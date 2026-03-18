import httpx
import re
import time
import asyncio
from typing import Dict, List, Set
from bs4 import BeautifulSoup
from app.config import settings


class EmailFinder:
    async def find(self, domain: str) -> Dict:
        start_time = time.time()
        emails: Set[str] = set()
        email_results = []

        tasks = [
            self._scrape_website(domain),
            self._search_google_cache(domain),
        ]

        if settings.HUNTER_API_KEY:
            tasks.append(self._hunter_search(domain))

        results = await asyncio.gather(
            *tasks, return_exceptions=True
        )

        for result in results:
            if isinstance(result, list):
                for item in result:
                    if item["email"] not in emails:
                        emails.add(item["email"])
                        email_results.append(item)

        return {
            "domain": domain,
            "total_found": len(email_results),
            "emails": email_results,
            "scan_time": round(time.time() - start_time, 2)
        }

    async def _hunter_search(self, domain: str) -> List[Dict]:
        """Use Hunter.io API"""
        results = []
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                url = "https://api.hunter.io/v2/domain-search"
                params = {
                    "domain": domain,
                    "api_key": settings.HUNTER_API_KEY
                }
                resp = await client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    for email_data in data.get("data", {}).get(
                        "emails", []
                    ):
                        results.append({
                            "email": email_data["value"],
                            "source": "Hunter.io",
                            "confidence": str(
                                email_data.get("confidence", "medium")
                            )
                        })
        except Exception as e:
            print(f"Hunter.io error: {e}")
        return results

    async def _scrape_website(self, domain: str) -> List[Dict]:
        """Scrape the target website for email addresses"""
        results = []
        urls_to_check = [
            f"https://{domain}",
            f"https://{domain}/contact",
            f"https://{domain}/about",
            f"https://{domain}/impressum",
            f"https://{domain}/privacy",
            f"http://{domain}",
        ]

        async with httpx.AsyncClient(
            timeout=10,
            follow_redirects=True,
            verify=False
        ) as client:
            for url in urls_to_check:
                try:
                    resp = await client.get(url, headers={
                        "User-Agent": (
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                            " AppleWebKit/537.36"
                        )
                    })
                    if resp.status_code == 200:
                        emails = self._extract_emails(
                            resp.text, domain
                        )
                        for email in emails:
                            results.append({
                                "email": email,
                                "source": f"Website ({url})",
                                "confidence": "high"
                            })
                except Exception:
                    continue

        return results

    async def _search_google_cache(self, domain: str) -> List[Dict]:
        """Search for emails in publicly cached pages"""
        results = []
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Try to search for emails using a public API or service
                # For now, we'll skip this as it requires API keys
                # Could integrate with free services like emailrep.io for validation
                pass
        except Exception as e:
            print(f"Search error: {e}")
        return results

    def _extract_emails(self, html: str, domain: str) -> List[str]:
        """Extract email addresses from HTML content"""
        email_pattern = (
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        )
        all_emails = re.findall(email_pattern, html)
        # Filter to domain-related emails and clean up
        domain_emails = []
        seen = set()
        for email in all_emails:
            email = email.lower().strip()
            if email not in seen and (
                domain in email
                or not email.endswith((".png", ".jpg", ".gif"))
            ):
                seen.add(email)
                domain_emails.append(email)
        return domain_emails[:50]  # Limit results