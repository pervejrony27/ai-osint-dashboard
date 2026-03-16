import time
import json
from typing import Dict, Optional
from app.config import settings


class AISummarizer:
    async def summarize(self, scan_data: Dict) -> Dict:
        start_time = time.time()

        if settings.OPENAI_API_KEY:
            result = await self._openai_summarize(scan_data)
        else:
            result = self._local_summarize(scan_data)

        result["scan_time"] = round(time.time() - start_time, 2)
        return result

    async def _openai_summarize(self, scan_data: Dict) -> Dict:
        """Use OpenAI API for intelligent risk assessment"""
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        prompt = self._build_prompt(scan_data)

        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a senior cybersecurity analyst. "
                            "Analyze OSINT reconnaissance data and "
                            "provide a professional risk assessment. "
                            "Respond in valid JSON format only."
                        )
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )

            result = json.loads(
                response.choices[0].message.content
            )

            return {
                "domain": scan_data.get("domain", "unknown"),
                "risk_score": min(100, max(0,
                    result.get("risk_score", 50)
                )),
                "risk_level": result.get("risk_level", "medium"),
                "executive_summary": result.get(
                    "executive_summary", ""
                ),
                "findings": result.get("findings", []),
                "recommendations": result.get(
                    "recommendations", []
                ),
            }
        except Exception as e:
            print(f"OpenAI error: {e}")
            return self._local_summarize(scan_data)

    def _local_summarize(self, scan_data: Dict) -> Dict:
        """Fallback: rule-based risk assessment"""
        domain = scan_data.get("domain", "unknown")
        findings = []
        risk_score = 0
        recommendations = []

        # Analyze subdomains
        sub_data = scan_data.get("subdomains")
        if sub_data:
            count = sub_data.get("total_found", 0)
            if count > 50:
                risk_score += 15
                findings.append({
                    "category": "Attack Surface",
                    "severity": "high",
                    "finding": (
                        f"{count} subdomains discovered — "
                        f"large attack surface"
                    ),
                    "recommendation": (
                        "Audit all subdomains, remove unused ones, "
                        "ensure all are patched and monitored."
                    )
                })
            elif count > 20:
                risk_score += 8
                findings.append({
                    "category": "Attack Surface",
                    "severity": "medium",
                    "finding": f"{count} subdomains discovered",
                    "recommendation": (
                        "Review subdomains periodically."
                    )
                })
            elif count > 0:
                risk_score += 3
                findings.append({
                    "category": "Attack Surface",
                    "severity": "low",
                    "finding": f"{count} subdomains discovered",
                    "recommendation": (
                        "Normal subdomain count. Keep monitoring."
                    )
                })

        # Analyze ports
        port_data = scan_data.get("ports")
        if port_data:
            open_ports = port_data.get("total_open", 0)
            port_list = port_data.get("ports", [])

            risky_ports = [
                p for p in port_list
                if p.get("port") in [
                    21, 23, 445, 3389, 5900,
                    6379, 27017, 1433, 1521
                ]
            ]

            if risky_ports:
                risk_score += 25
                port_names = ", ".join(
                    f"{p['port']}/{p['service']}"
                    for p in risky_ports
                )
                findings.append({
                    "category": "Open Ports",
                    "severity": "critical",
                    "finding": (
                        f"High-risk ports exposed: {port_names}"
                    ),
                    "recommendation": (
                        "Immediately restrict access to these ports "
                        "using firewall rules. Use VPN for "
                        "remote access."
                    )
                })

            if open_ports > 10:
                risk_score += 10
                findings.append({
                    "category": "Open Ports",
                    "severity": "high",
                    "finding": f"{open_ports} open ports detected",
                    "recommendation": (
                        "Reduce attack surface by closing "
                        "unnecessary ports."
                    )
                })
            elif open_ports > 0:
                risk_score += 3
                findings.append({
                    "category": "Open Ports",
                    "severity": "info",
                    "finding": f"{open_ports} open ports detected",
                    "recommendation": (
                        "Standard exposure. Ensure services "
                        "are up to date."
                    )
                })

        # Analyze breaches
        breach_data = scan_data.get("breaches")
        if breach_data:
            breach_count = breach_data.get("total_breaches", 0)
            exposed = breach_data.get("total_records_exposed", 0)
            if breach_count > 0:
                risk_score += min(30, breach_count * 10)
                findings.append({
                    "category": "Data Breaches",
                    "severity": "critical" if exposed > 100000
                    else "high",
                    "finding": (
                        f"{breach_count} breaches found, "
                        f"{exposed:,} records exposed"
                    ),
                    "recommendation": (
                        "Enforce password resets, enable MFA, "
                        "monitor for credential stuffing attacks."
                    )
                })

        # Analyze emails
        email_data = scan_data.get("emails")
        if email_data:
            email_count = email_data.get("total_found", 0)
            if email_count > 20:
                risk_score += 10
                findings.append({
                    "category": "Email Exposure",
                    "severity": "medium",
                    "finding": (
                        f"{email_count} email addresses found publicly"
                    ),
                    "recommendation": (
                        "High phishing risk. Implement email security "
                        "(SPF, DKIM, DMARC) and security awareness "
                        "training."
                    )
                })
            elif email_count > 0:
                risk_score += 4
                findings.append({
                    "category": "Email Exposure",
                    "severity": "low",
                    "finding": (
                        f"{email_count} email addresses found publicly"
                    ),
                    "recommendation": (
                        "Monitor for phishing attempts targeting "
                        "these addresses."
                    )
                })

        # Analyze tech stack
        tech_data = scan_data.get("tech")
        if tech_data:
            techs = tech_data.get("technologies", [])
            security_headers = [
                t for t in techs
                if t.get("category") == "Security Header"
            ]
            missing_headers = []
            expected = [
                "Strict-Transport-Security Header",
                "Content-Security-Policy Header",
                "X-Frame-Options Header",
                "X-Content-Type-Options Header"
            ]
            found_names = [t["name"] for t in security_headers]
            for h in expected:
                if h not in found_names:
                    missing_headers.append(
                        h.replace(" Header", "")
                    )

            if missing_headers:
                risk_score += len(missing_headers) * 3
                findings.append({
                    "category": "Security Headers",
                    "severity": "medium",
                    "finding": (
                        "Missing security headers: "
                        + ", ".join(missing_headers)
                    ),
                    "recommendation": (
                        "Implement all recommended security headers."
                    )
                })

        # Cap risk score
        risk_score = min(100, risk_score)

        # Determine risk level
        if risk_score >= 75:
            risk_level = "critical"
        elif risk_score >= 50:
            risk_level = "high"
        elif risk_score >= 25:
            risk_level = "medium"
        else:
            risk_level = "low"

        # Generate summary
        summary = (
            f"OSINT assessment of {domain} reveals a {risk_level} "
            f"risk profile (score: {risk_score}/100). "
            f"The analysis identified {len(findings)} findings "
            f"across attack surface, exposed services, data breaches, "
            f"and security configuration."
        )

        # Generate recommendations
        if risk_score >= 50:
            recommendations.extend([
                "Conduct a full penetration test immediately",
                "Review and harden firewall configurations",
                "Implement continuous security monitoring",
            ])
        recommendations.extend([
            "Enable Multi-Factor Authentication (MFA) organization-wide",
            "Implement security awareness training for employees",
            "Set up continuous OSINT monitoring for the domain",
            "Review and update incident response procedures",
        ])

        return {
            "domain": domain,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "executive_summary": summary,
            "findings": findings,
            "recommendations": recommendations[:8],
        }

    def _build_prompt(self, scan_data: Dict) -> str:
        return f"""Analyze this OSINT reconnaissance data for the domain "{scan_data.get('domain')}" and provide a cybersecurity risk assessment.

DATA COLLECTED:
{json.dumps(scan_data, indent=2, default=str)[:8000]}

Respond with this exact JSON structure:
{{
    "risk_score": <0-100 integer>,
    "risk_level": "<critical|high|medium|low>",
    "executive_summary": "<2-3 paragraph professional summary>",
    "findings": [
        {{
            "category": "<category>",
            "severity": "<critical|high|medium|low|info>",
            "finding": "<description>",
            "recommendation": "<specific action>"
        }}
    ],
    "recommendations": ["<top 5-8 prioritized recommendations>"]
}}"""