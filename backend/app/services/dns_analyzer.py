import dns.resolver
import dns.reversename
import time
import asyncio
from typing import Dict, List


class DnsAnalyzer:
    RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME", "SOA", "SRV"]

    async def analyze(self, domain: str) -> Dict:
        start_time = time.time()
        records = []
        nameservers = []

        loop = asyncio.get_event_loop()

        for rtype in self.RECORD_TYPES:
            try:
                result = await loop.run_in_executor(
                    None, self._query_record, domain, rtype
                )
                records.extend(result)
            except Exception:
                continue

        # Get nameservers
        try:
            ns_result = await loop.run_in_executor(
                None, self._query_record, domain, "NS"
            )
            nameservers = [r["value"] for r in ns_result]
        except Exception:
            pass

        return {
            "domain": domain,
            "records": records,
            "nameservers": nameservers,
            "scan_time": round(time.time() - start_time, 2)
        }

    def _query_record(self, domain: str, record_type: str) -> List[Dict]:
        records = []
        try:
            resolver = dns.resolver.Resolver()
            resolver.timeout = 10
            resolver.lifetime = 10
            answers = resolver.resolve(domain, record_type)

            for rdata in answers:
                record = {
                    "record_type": record_type,
                    "name": domain,
                    "value": str(rdata),
                    "ttl": answers.rrset.ttl
                }

                if record_type == "MX":
                    record["value"] = (
                        f"{rdata.preference} {rdata.exchange}"
                    )
                elif record_type == "SOA":
                    record["value"] = (
                        f"Primary NS: {rdata.mname}, "
                        f"Email: {rdata.rname}, "
                        f"Serial: {rdata.serial}"
                    )

                records.append(record)
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN,
                dns.resolver.NoNameservers, dns.exception.Timeout):
            pass
        except Exception as e:
            print(f"DNS query error for {record_type}: {e}")
        return records