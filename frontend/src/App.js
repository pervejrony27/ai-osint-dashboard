import React, { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import Header from "./components/Header";
import ScanForm from "./components/ScanForm";
import ScanProgress from "./components/ScanProgress";
import Dashboard from "./components/Dashboard";
import {
  scanSubdomains,
  scanDns,
  scanPorts,
  findEmails,
  checkBreaches,
  detectTech,
  generateSummary,
} from "./services/api";

const MODULES = [
  { key: "subdomains", label: "Subdomains", fn: scanSubdomains },
  { key: "dns", label: "DNS Records", fn: scanDns },
  { key: "ports", label: "Open Ports", fn: scanPorts },
  { key: "emails", label: "Emails", fn: findEmails },
  { key: "breaches", label: "Breaches", fn: checkBreaches },
  { key: "tech", label: "Tech Stack", fn: detectTech },
];

function App() {
  const [scanning, setScanning] = useState(false);
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState({});
  const [moduleStatus, setModuleStatus] = useState({});
  const [scanComplete, setScanComplete] = useState(false);

  const startScan = useCallback(async (targetDomain) => {
    // Clean domain input
    let cleaned = targetDomain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./, "");

    if (!cleaned || !cleaned.includes(".")) {
      toast.error("Please enter a valid domain (e.g. example.com)");
      return;
    }

    setDomain(cleaned);
    setScanning(true);
    setScanComplete(false);
    setResults({});

    // Initialize module statuses
    const initialStatus = {};
    MODULES.forEach((m) => (initialStatus[m.key] = "pending"));
    initialStatus["summary"] = "pending";
    setModuleStatus(initialStatus);

    toast.success(`Starting OSINT scan for ${cleaned}`);

    // Run all modules in parallel
    const moduleResults = {};

    const promises = MODULES.map(async (mod) => {
      setModuleStatus((prev) => ({ ...prev, [mod.key]: "running" }));
      try {
        const response = await mod.fn(cleaned);
        moduleResults[mod.key] = response.data;
        setResults((prev) => ({ ...prev, [mod.key]: response.data }));
        setModuleStatus((prev) => ({ ...prev, [mod.key]: "completed" }));
        return { key: mod.key, data: response.data };
      } catch (error) {
        console.error(`${mod.key} error:`, error);
        setModuleStatus((prev) => ({ ...prev, [mod.key]: "error" }));
        return { key: mod.key, data: null };
      }
    });

    await Promise.allSettled(promises);

    // Generate AI summary
    setModuleStatus((prev) => ({ ...prev, summary: "running" }));
    try {
      const summaryPayload = {
        domain: cleaned,
        subdomains: moduleResults.subdomains || null,
        dns: moduleResults.dns || null,
        ports: moduleResults.ports || null,
        emails: moduleResults.emails || null,
        breaches: moduleResults.breaches || null,
        tech: moduleResults.tech || null,
      };
      const summaryResponse = await generateSummary(summaryPayload);
      setResults((prev) => ({ ...prev, summary: summaryResponse.data }));
      setModuleStatus((prev) => ({ ...prev, summary: "completed" }));
    } catch (error) {
      console.error("Summary error:", error);
      setModuleStatus((prev) => ({ ...prev, summary: "error" }));
    }

    setScanning(false);
    setScanComplete(true);
    toast.success("Scan complete!");
  }, []);

  return (
    <div className="min-h-screen bg-cyber-darker grid-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid rgba(6, 182, 212, 0.3)",
          },
        }}
      />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScanForm onScan={startScan} scanning={scanning} />

        {(scanning || scanComplete) && (
          <>
            <ScanProgress
              modules={[...MODULES, { key: "summary", label: "AI Summary" }]}
              status={moduleStatus}
              domain={domain}
            />
            <Dashboard
              domain={domain}
              results={results}
              moduleStatus={moduleStatus}
            />
          </>
        )}
      </main>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-cyber-border">
        <p>
          OSINT Dashboard — For authorized security assessments only.
        </p>
        <p className="mt-1">
          Ensure you have permission before scanning any domain.
        </p>
      </footer>
    </div>
  );
}

export default App;