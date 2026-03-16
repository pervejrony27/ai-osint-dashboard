import React from "react";
import { HiArrowDownTray } from "react-icons/hi2";

const ExportButton = ({ domain, results }) => {
  const handleExportJSON = () => {
    const report = {
      report_type: "OSINT Intelligence Report",
      domain: domain,
      generated_at: new Date().toISOString(),
      disclaimer:
        "This report contains publicly available information gathered through OSINT techniques.",
      ...results,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-report-${domain}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = "Category,Type,Value,Details\n";

    // Subdomains
    if (results.subdomains) {
      results.subdomains.subdomains.forEach((s) => {
        csv += `Subdomain,${s.status},${s.subdomain},${s.ip_address || "N/A"}\n`;
      });
    }

    // Ports
    if (results.ports) {
      results.ports.ports.forEach((p) => {
        csv += `Port,${p.service},${p.port},${p.state}\n`;
      });
    }

    // Emails
    if (results.emails) {
      results.emails.emails.forEach((e) => {
        csv += `Email,${e.source},${e.email},${e.confidence}\n`;
      });
    }

    // Breaches
    if (results.breaches) {
      results.breaches.breaches.forEach((b) => {
        csv += `Breach,${b.name},${b.breach_date},${b.pwn_count} records\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `osint-report-${domain}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 hover:bg-cyber-accent/20 transition-colors text-sm"
      >
        <HiArrowDownTray />
        Export JSON
      </button>
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors text-sm"
      >
        <HiArrowDownTray />
        Export CSV
      </button>
    </div>
  );
};

export default ExportButton;