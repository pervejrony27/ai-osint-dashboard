import httpx
import asyncio
import time
import socket
from typing import List, Dict
from app.config import settings


class SubdomainScanner:
    def __init__(self):
        self.sources_used = []

    async def scan(self, domain: str) -> Dict:
        start_time = time.time()
        subdomains = set()

        tasks = [self._crtsh_scan(domain)]

        if settings.SECURITYTRAILS_API_KEY:
            tasks.append(self._securitytrails_scan(domain))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, set):
                subdomains.update(result)

        subdomain_results = []
        resolve_tasks = [
            self._resolve_subdomain(s) for s in sorted(subdomains)
        ]
        resolved = await asyncio.gather(*resolve_tasks, return_exceptions=True)

        for sub, res in zip(sorted(subdomains), resolved):
            if isinstance(res, dict):
                subdomain_results.append(res)
            else:
                subdomain_results.append({
                    "subdomain": sub,
                    "ip_address": None,
                    "status": "unresolved"
                })

        return {
            "domain": domain,
            "total_found": len(subdomain_results),
            "subdomains": subdomain_results,
            "sources": self.sources_used,
            "scan_time": round(time.time() - start_time, 2)
        }

    async def _crtsh_scan(self, domain: str) -> set:
        """Use crt.sh Certificate Transparency logs (FREE)"""
        subdomains = set()
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                url = f"https://crt.sh/?q=%.{domain}&output=json"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    for entry in data:
                        name = entry.get("name_value", "")
                        for sub in name.split("\n"):
                            sub = sub.strip().lower()
                            if sub.endswith(f".{domain}") or sub == domain:
                                sub = sub.lstrip("*.")
                                if sub:
                                    subdomains.add(sub)
                    self.sources_used.append("crt.sh")
        except Exception as e:
            print(f"crt.sh error: {e}")
        return subdomains

    async def _securitytrails_scan(self, domain: str) -> set:
        """Use SecurityTrails API (requires API key)"""
        subdomains = set()
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                url = f"https://api.securitytrails.com/v1/domain/{domain}/subdomains"
                headers = {"APIKEY": settings.SECURITYTRAILS_API_KEY}
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    for sub in data.get("subdomains", []):
                        subdomains.add(f"{sub}.{domain}")
                    self.sources_used.append("SecurityTrails")
        except Exception as e:
            print(f"SecurityTrails error: {e}")
        return subdomains

    async def _resolve_subdomain(self, subdomain: str) -> Dict:
        """Resolve subdomain to IP address"""
        try:
            loop = asyncio.get_event_loop()
            ip = await loop.run_in_executor(
                None, lambda: socket.gethostbyname(subdomain)
            )
            return {
                "subdomain": subdomain,
                "ip_address": ip,
                "status": "active"
            }
        except socket.gaierror:
            return {
                "subdomain": subdomain,
                "ip_address": None,
                "status": "inactive"
            }
        except Exception:
            return {
                "subdomain": subdomain,
                "ip_address": None,
                "status": "unknown"
            }