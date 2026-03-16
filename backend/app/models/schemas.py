from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ScanStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"


class DomainRequest(BaseModel):
    domain: str = Field(..., example="example.com",
                        description="Target domain to scan")


class SubdomainResult(BaseModel):
    subdomain: str
    ip_address: Optional[str] = None
    status: Optional[str] = None


class SubdomainResponse(BaseModel):
    domain: str
    total_found: int
    subdomains: List[SubdomainResult]
    sources: List[str]
    scan_time: float


class DnsRecord(BaseModel):
    record_type: str
    name: str
    value: str
    ttl: Optional[int] = None


class DnsResponse(BaseModel):
    domain: str
    records: List[DnsRecord]
    nameservers: List[str]
    scan_time: float


class PortResult(BaseModel):
    port: int
    state: str
    service: str
    version: Optional[str] = None
    banner: Optional[str] = None


class PortResponse(BaseModel):
    domain: str
    ip_address: str
    total_open: int
    ports: List[PortResult]
    scan_time: float
    source: str


class EmailResult(BaseModel):
    email: str
    source: str
    confidence: Optional[str] = "medium"


class EmailResponse(BaseModel):
    domain: str
    total_found: int
    emails: List[EmailResult]
    scan_time: float


class BreachResult(BaseModel):
    name: str
    breach_date: Optional[str] = None
    description: Optional[str] = None
    data_types: List[str] = []
    pwn_count: Optional[int] = None
    is_verified: bool = True


class BreachResponse(BaseModel):
    domain: str
    total_breaches: int
    breaches: List[BreachResult]
    total_records_exposed: int
    scan_time: float


class TechResult(BaseModel):
    name: str
    category: str
    confidence: str
    version: Optional[str] = None
    icon: Optional[str] = None


class TechResponse(BaseModel):
    domain: str
    technologies: List[TechResult]
    headers: Dict[str, str]
    scan_time: float


class RiskItem(BaseModel):
    category: str
    severity: str  # critical, high, medium, low, info
    finding: str
    recommendation: str


class SummaryRequest(BaseModel):
    domain: str
    subdomains: Optional[SubdomainResponse] = None
    dns: Optional[DnsResponse] = None
    ports: Optional[PortResponse] = None
    emails: Optional[EmailResponse] = None
    breaches: Optional[BreachResponse] = None
    tech: Optional[TechResponse] = None


class SummaryResponse(BaseModel):
    domain: str
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    executive_summary: str
    findings: List[RiskItem]
    recommendations: List[str]
    scan_time: float


class FullScanResponse(BaseModel):
    domain: str
    scan_id: str
    timestamp: str
    subdomains: Optional[SubdomainResponse] = None
    dns: Optional[DnsResponse] = None
    ports: Optional[PortResponse] = None
    emails: Optional[EmailResponse] = None
    breaches: Optional[BreachResponse] = None
    tech: Optional[TechResponse] = None
    summary: Optional[SummaryResponse] = None