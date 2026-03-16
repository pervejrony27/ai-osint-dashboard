import asyncio
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DomainRequest, SubdomainResponse, DnsResponse,
    PortResponse, EmailResponse, BreachResponse,
    TechResponse, SummaryRequest, SummaryResponse,
    FullScanResponse
)
from app.services import (
    SubdomainScanner, DnsAnalyzer, PortScanner,
    EmailFinder, BreachChecker, TechDetector, AISummarizer
)

router = APIRouter(prefix="/api/scan", tags=["Scanning"])


@router.post("/subdomains", response_model=SubdomainResponse)
async def scan_subdomains(request: DomainRequest):
    """Enumerate subdomains using CT logs and APIs"""
    try:
        scanner = SubdomainScanner()
        result = await scanner.scan(request.domain)
        return SubdomainResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Subdomain scan failed: {str(e)}"
        )


@router.post("/dns", response_model=DnsResponse)
async def scan_dns(request: DomainRequest):
    """Analyze DNS records"""
    try:
        analyzer = DnsAnalyzer()
        result = await analyzer.analyze(request.domain)
        return DnsResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DNS analysis failed: {str(e)}"
        )


@router.post("/ports", response_model=PortResponse)
async def scan_ports(request: DomainRequest):
    """Discover open ports and services"""
    try:
        scanner = PortScanner()
        result = await scanner.scan(request.domain)
        return PortResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Port scan failed: {str(e)}"
        )


@router.post("/emails", response_model=EmailResponse)
async def find_emails(request: DomainRequest):
    """Find publicly exposed email addresses"""
    try:
        finder = EmailFinder()
        result = await finder.find(request.domain)
        return EmailResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Email search failed: {str(e)}"
        )


@router.post("/breaches", response_model=BreachResponse)
async def check_breaches(request: DomainRequest):
    """Check for data breaches"""
    try:
        checker = BreachChecker()
        result = await checker.check(request.domain)
        return BreachResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Breach check failed: {str(e)}"
        )


@router.post("/tech", response_model=TechResponse)
async def detect_tech(request: DomainRequest):
    """Detect technology stack"""
    try:
        detector = TechDetector()
        result = await detector.detect(request.domain)
        return TechResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Tech detection failed: {str(e)}"
        )


@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate AI-powered risk summary"""
    try:
        summarizer = AISummarizer()
        scan_data = {
            "domain": request.domain,
            "subdomains": (request.subdomains.model_dump()
                           if request.subdomains else None),
            "dns": (request.dns.model_dump()
                    if request.dns else None),
            "ports": (request.ports.model_dump()
                      if request.ports else None),
            "emails": (request.emails.model_dump()
                       if request.emails else None),
            "breaches": (request.breaches.model_dump()
                         if request.breaches else None),
            "tech": (request.tech.model_dump()
                     if request.tech else None),
        }
        result = await summarizer.summarize(scan_data)
        return SummaryResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summary generation failed: {str(e)}"
        )


@router.post("/full", response_model=FullScanResponse)
async def full_scan(request: DomainRequest):
    """Run all scans and generate complete report"""
    scan_id = str(uuid.uuid4())[:8]
    domain = request.domain

    # Run all scans in parallel
    results = await asyncio.gather(
        _safe_scan("subdomains", SubdomainScanner().scan, domain),
        _safe_scan("dns", DnsAnalyzer().analyze, domain),
        _safe_scan("ports", PortScanner().scan, domain),
        _safe_scan("emails", EmailFinder().find, domain),
        _safe_scan("breaches", BreachChecker().check, domain),
        _safe_scan("tech", TechDetector().detect, domain),
    )

    scan_results = {}
    for name, data in results:
        scan_results[name] = data

    # Generate AI summary
    try:
        summarizer = AISummarizer()
        summary = await summarizer.summarize({
            "domain": domain, **scan_results
        })
        scan_results["summary"] = summary
    except Exception as e:
        print(f"Summary error: {e}")
        scan_results["summary"] = None

    return FullScanResponse(
        domain=domain,
        scan_id=scan_id,
        timestamp=datetime.utcnow().isoformat(),
        **scan_results
    )


async def _safe_scan(name: str, func, domain: str):
    """Wrapper that catches errors per module"""
    try:
        result = await func(domain)
        return (name, result)
    except Exception as e:
        print(f"Error in {name}: {e}")
        return (name, None)