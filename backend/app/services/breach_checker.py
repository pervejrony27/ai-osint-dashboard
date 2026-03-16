import httpx
import time
from typing import Dict, List
from app.config import settings


class BreachChecker:
    HIBP_BASE = "https://haveibeenpwned.com/api/v3"

    async def check(self, domain: str) -> Dict:
        start_time = time.time()
        breaches = []
        total_exposed = 0

        if settings.HIBP_API_KEY:
            breaches = await self._hibp_domain_search(domain)
            for b in breaches:
                total_exposed += b.get("pwn_count", 0)
        else:
            # Free alternative: check known breaches list
            breaches = await self._free_breach_check(domain)
            for b in breaches:
                total_exposed += b.get("pwn_count", 0)

        return {
            "domain": domain,
            "total_breaches": len(breaches),
            "breaches": breaches,
            "total_records_exposed": total_exposed,
            "scan_time": round(time.time() - start_time, 2)
        }

    async def _hibp_domain_search(
        self, domain: str
    ) -> List[Dict]:
        """Search HaveIBeenPwned for domain breaches"""
        results = []
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                url = f"{self.HIBP_BASE}/breaches"
                headers = {
                    "hibp-api-key": settings.HIBP_API_KEY,
                    "User-Agent": "OSINT-Dashboard"
                }
                resp = await client.get(url, headers=headers)

                if resp.status_code == 200:
                    all_breaches = resp.json()
                    for breach in all_breaches:
                        breach_domain = breach.get("Domain", "").lower()
                        if (domain.lower() in breach_domain
                                or breach_domain in domain.lower()):
                            results.append({
                                "name": breach.get("Name", "Unknown"),
                                "breach_date": breach.get(
                                    "BreachDate", "Unknown"
                                ),
                                "description": self._clean_html(
                                    breach.get("Description", "")
                                ),
                                "data_types": breach.get(
                                    "DataClasses", []
                                ),
                                "pwn_count": breach.get("PwnCount", 0),
                                "is_verified": breach.get(
                                    "IsVerified", False
                                )
                            })
        except Exception as e:
            print(f"HIBP error: {e}")
        return results

    async def _free_breach_check(self, domain: str) -> List[Dict]:
        """Free breach check using BreachDirectory-style APIs"""
        results = []
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                # Use the free HIBP breaches endpoint (no key needed)
                url = "https://haveibeenpwned.com/api/v3/breaches"
                headers = {
                    "User-Agent": "OSINT-Dashboard-Free"
                }
                resp = await client.get(url, headers=headers)

                if resp.status_code == 200:
                    all_breaches = resp.json()
                    for breach in all_breaches:
                        breach_domain = breach.get(
                            "Domain", ""
                        ).lower()
                        if domain.lower() == breach_domain:
                            results.append({
                                "name": breach.get(
                                    "Name", "Unknown"
                                ),
                                "breach_date": breach.get(
                                    "BreachDate", "Unknown"
                                ),
                                "description": self._clean_html(
                                    breach.get("Description", "")
                                ),
                                "data_types": breach.get(
                                    "DataClasses", []
                                ),
                                "pwn_count": breach.get(
                                    "PwnCount", 0
                                ),
                                "is_verified": breach.get(
                                    "IsVerified", False
                                )
                            })
        except Exception as e:
            print(f"Free breach check error: {e}")
        return results

    def _clean_html(self, text: str) -> str:
        import re
        clean = re.sub(r'<[^>]+>', '', text)
        return clean[:500]