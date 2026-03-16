import asyncio
import socket
import time
from typing import Dict, List
from app.config import settings

COMMON_PORTS = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
    53: "DNS", 80: "HTTP", 110: "POP3", 111: "RPCBind",
    135: "MSRPC", 139: "NetBIOS", 143: "IMAP", 443: "HTTPS",
    445: "SMB", 587: "SMTP/TLS", 993: "IMAPS", 995: "POP3S",
    1433: "MSSQL", 1521: "Oracle", 3306: "MySQL",
    3389: "RDP", 5432: "PostgreSQL", 5900: "VNC",
    6379: "Redis", 8080: "HTTP-Proxy", 8443: "HTTPS-Alt",
    8888: "HTTP-Alt", 9090: "Proxy", 27017: "MongoDB"
}


class PortScanner:
    async def scan(self, domain: str) -> Dict:
        start_time = time.time()

        # Resolve domain to IP first
        try:
            loop = asyncio.get_event_loop()
            ip_address = await loop.run_in_executor(
                None, socket.gethostbyname, domain
            )
        except socket.gaierror:
            return {
                "domain": domain,
                "ip_address": "unresolved",
                "total_open": 0,
                "ports": [],
                "scan_time": round(time.time() - start_time, 2),
                "source": "error"
            }

        # Try Shodan first if API key available
        if settings.SHODAN_API_KEY:
            try:
                result = await self._shodan_scan(domain, ip_address)
                if result:
                    result["scan_time"] = round(
                        time.time() - start_time, 2
                    )
                    return result
            except Exception as e:
                print(f"Shodan error: {e}")

        # Fallback: socket scan
        result = await self._socket_scan(domain, ip_address)
        result["scan_time"] = round(time.time() - start_time, 2)
        return result

    async def _shodan_scan(
        self, domain: str, ip_address: str
    ) -> Dict:
        """Use Shodan API for port information"""
        import httpx

        async with httpx.AsyncClient(timeout=20) as client:
            url = f"https://api.shodan.io/shodan/host/{ip_address}"
            params = {"key": settings.SHODAN_API_KEY}
            resp = await client.get(url, params=params)

            if resp.status_code == 200:
                data = resp.json()
                ports = []

                for item in data.get("data", []):
                    port_info = {
                        "port": item.get("port"),
                        "state": "open",
                        "service": item.get("product",
                                            COMMON_PORTS.get(
                                                item.get("port"),
                                                "unknown"
                                            )),
                        "version": item.get("version"),
                        "banner": (item.get("data", "")[:200]
                                   if item.get("data") else None)
                    }
                    ports.append(port_info)

                return {
                    "domain": domain,
                    "ip_address": ip_address,
                    "total_open": len(ports),
                    "ports": sorted(ports, key=lambda x: x["port"]),
                    "source": "Shodan"
                }
        return None

    async def _socket_scan(
        self, domain: str, ip_address: str
    ) -> Dict:
        """Fallback: async socket scan on common ports"""
        open_ports = []

        async def check_port(port: int, service: str):
            try:
                conn = asyncio.open_connection(
                    ip_address, port
                )
                reader, writer = await asyncio.wait_for(
                    conn, timeout=3
                )

                # Try to grab banner
                banner = None
                try:
                    writer.write(b"HEAD / HTTP/1.0\r\n\r\n")
                    data = await asyncio.wait_for(
                        reader.read(200), timeout=2
                    )
                    banner = data.decode("utf-8", errors="ignore").strip()
                except Exception:
                    pass

                writer.close()
                try:
                    await writer.wait_closed()
                except Exception:
                    pass

                open_ports.append({
                    "port": port,
                    "state": "open",
                    "service": service,
                    "version": None,
                    "banner": banner[:200] if banner else None
                })
            except (asyncio.TimeoutError, ConnectionRefusedError,
                    OSError):
                pass

        tasks = [
            check_port(port, service)
            for port, service in COMMON_PORTS.items()
        ]
        await asyncio.gather(*tasks)

        return {
            "domain": domain,
            "ip_address": ip_address,
            "total_open": len(open_ports),
            "ports": sorted(open_ports, key=lambda x: x["port"]),
            "source": "Socket Scan"
        }