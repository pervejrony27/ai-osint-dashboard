import httpx
import re
import time
from typing import Dict, List
from bs4 import BeautifulSoup


# Technology fingerprint database
TECH_SIGNATURES = {
    "headers": {
        "Server": {
            "nginx": ("Nginx", "Web Server"),
            "apache": ("Apache", "Web Server"),
            "cloudflare": ("Cloudflare", "CDN"),
            "microsoft-iis": ("Microsoft IIS", "Web Server"),
            "litespeed": ("LiteSpeed", "Web Server"),
            "gunicorn": ("Gunicorn", "Web Server"),
            "openresty": ("OpenResty", "Web Server"),
        },
        "X-Powered-By": {
            "php": ("PHP", "Programming Language"),
            "asp.net": ("ASP.NET", "Framework"),
            "express": ("Express.js", "Framework"),
            "next.js": ("Next.js", "Framework"),
            "nuxt": ("Nuxt.js", "Framework"),
        },
        "X-Generator": {
            "wordpress": ("WordPress", "CMS"),
            "drupal": ("Drupal", "CMS"),
            "joomla": ("Joomla", "CMS"),
        }
    },
    "html_patterns": [
        (r'wp-content|wp-includes', "WordPress", "CMS"),
        (r'drupal\.settings', "Drupal", "CMS"),
        (r'joomla', "Joomla", "CMS"),
        (r'react', "React", "JavaScript Framework"),
        (r'__next', "Next.js", "Framework"),
        (r'__nuxt|nuxt', "Nuxt.js", "Framework"),
        (r'ng-version|angular', "Angular", "JavaScript Framework"),
        (r'vue\.js|vue\.min\.js|vue@', "Vue.js", "JavaScript Framework"),
        (r'jquery', "jQuery", "JavaScript Library"),
        (r'bootstrap', "Bootstrap", "CSS Framework"),
        (r'tailwindcss|tailwind', "Tailwind CSS", "CSS Framework"),
        (r'google-analytics|gtag|GA_TRACKING', "Google Analytics", "Analytics"),
        (r'googletagmanager', "Google Tag Manager", "Analytics"),
        (r'hotjar', "Hotjar", "Analytics"),
        (r'cloudflare', "Cloudflare", "CDN"),
        (r'cdn\.shopify', "Shopify", "E-Commerce"),
        (r'stripe\.com|stripe\.js', "Stripe", "Payment"),
        (r'recaptcha', "reCAPTCHA", "Security"),
        (r'fontawesome|font-awesome', "Font Awesome", "Icon Library"),
        (r'gsap|greensock', "GSAP", "Animation Library"),
        (r'webpack', "Webpack", "Build Tool"),
        (r'vite', "Vite", "Build Tool"),
        (r'laravel', "Laravel", "Framework"),
        (r'rails|ruby on rails', "Ruby on Rails", "Framework"),
        (r'django', "Django", "Framework"),
        (r'flask', "Flask", "Framework"),
    ],
    "cookie_patterns": {
        "PHPSESSID": ("PHP", "Programming Language"),
        "csrftoken": ("Django", "Framework"),
        "laravel_session": ("Laravel", "Framework"),
        "JSESSIONID": ("Java", "Programming Language"),
        "ASP.NET": ("ASP.NET", "Framework"),
        "_shopify": ("Shopify", "E-Commerce"),
        "wp-settings": ("WordPress", "CMS"),
    }
}


class TechDetector:
    async def detect(self, domain: str) -> Dict:
        start_time = time.time()
        technologies = []
        seen_techs = set()
        response_headers = {}

        for scheme in ["https", "http"]:
            url = f"{scheme}://{domain}"
            try:
                async with httpx.AsyncClient(
                    timeout=15,
                    follow_redirects=True,
                    verify=False
                ) as client:
                    resp = await client.get(url, headers={
                        "User-Agent": (
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                            " AppleWebKit/537.36 (KHTML, like Gecko)"
                            " Chrome/120.0.0.0 Safari/537.36"
                        )
                    })

                    response_headers = dict(resp.headers)

                    # Check headers
                    for header_name, sigs in (
                        TECH_SIGNATURES["headers"].items()
                    ):
                        header_val = resp.headers.get(
                            header_name, ""
                        ).lower()
                        for pattern, (name, category) in sigs.items():
                            if pattern in header_val:
                                if name not in seen_techs:
                                    seen_techs.add(name)
                                    version = self._extract_version(
                                        header_val, pattern
                                    )
                                    technologies.append({
                                        "name": name,
                                        "category": category,
                                        "confidence": "high",
                                        "version": version
                                    })

                    # HTTPS detection
                    if scheme == "https":
                        if "HTTPS" not in seen_techs:
                            seen_techs.add("HTTPS")
                            technologies.append({
                                "name": "SSL/TLS",
                                "category": "Security",
                                "confidence": "high",
                                "version": None
                            })

                    # Check HTML content
                    html = resp.text
                    for pattern, name, category in (
                        TECH_SIGNATURES["html_patterns"]
                    ):
                        if re.search(pattern, html, re.IGNORECASE):
                            if name not in seen_techs:
                                seen_techs.add(name)
                                technologies.append({
                                    "name": name,
                                    "category": category,
                                    "confidence": "medium",
                                    "version": None
                                })

                    # Check cookies
                    cookies = resp.headers.get("set-cookie", "")
                    for cookie_name, (name, category) in (
                        TECH_SIGNATURES["cookie_patterns"].items()
                    ):
                        if cookie_name.lower() in cookies.lower():
                            if name not in seen_techs:
                                seen_techs.add(name)
                                technologies.append({
                                    "name": name,
                                    "category": category,
                                    "confidence": "medium",
                                    "version": None
                                })

                    # Check security headers
                    security_headers = [
                        "Strict-Transport-Security",
                        "Content-Security-Policy",
                        "X-Frame-Options",
                        "X-Content-Type-Options",
                        "X-XSS-Protection",
                        "Referrer-Policy",
                        "Permissions-Policy"
                    ]
                    for sh in security_headers:
                        if sh in resp.headers:
                            tech_name = f"{sh} Header"
                            if tech_name not in seen_techs:
                                seen_techs.add(tech_name)
                                technologies.append({
                                    "name": tech_name,
                                    "category": "Security Header",
                                    "confidence": "high",
                                    "version": None
                                })

                    break  # Success, don't try http

            except Exception as e:
                print(f"Tech detection error ({scheme}): {e}")
                continue

        # Clean headers for response
        safe_headers = {
            k: v for k, v in response_headers.items()
            if k.lower() not in ["set-cookie"]
        }

        return {
            "domain": domain,
            "technologies": technologies,
            "headers": safe_headers,
            "scan_time": round(time.time() - start_time, 2)
        }

    def _extract_version(
        self, header_value: str, tech_name: str
    ) -> str:
        version_match = re.search(
            rf'{tech_name}[/\s]*([\d.]+)', header_value
        )
        if version_match:
            return version_match.group(1)
        return None