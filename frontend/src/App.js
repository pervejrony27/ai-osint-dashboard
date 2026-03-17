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

  // Reset everything for a new scan
  const resetScan = useCallback(() => {
    setScanning(false);
    setDomain("");
    setResults({});
    setModuleStatus({});
    setScanComplete(false);
    toast.success("Ready for a new scan!");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            {/* New Scan Button — Shows after scan completes */}
            {scanComplete && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={resetScan}
                  className="group relative flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-cyber-accent to-cyber-purple text-cyber-dark hover:shadow-lg hover:shadow-cyber-accent/25 hover:scale-105 active:scale-95"
                >
                  {/* Glow effect behind button */}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-accent to-cyber-purple blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="relative">Scan Another Domain</span>
                </button>
              </div>
            )}

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
  <div className="max-w-2xl mx-auto">
    <p className="text-amber-400 font-semibold mb-2">
      ⚠️ Legal Disclaimer
    </p>

    <p>
      This tool is designed for authorized security assessments only.
      Only scan domains you own or have explicit written permission to test.
      Unauthorized scanning may violate computer crime laws in your jurisdiction.
    </p>

    <p className="mt-2">
      The developer is not responsible for any misuse of this tool.
      By using this tool, you agree that you have proper authorization.
    </p>

    <p className="mt-4 text-gray-500 flex flex-wrap justify-center items-center gap-3">
      <span>Built by</span>

      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyber-accent hover:text-cyber-glow transition-colors"
      >
        MD Pervej Ahmed Rony
      </a>

      <span>|</span>

      <a
        href="https://www.linkedin.com/in/pervejahmed/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyber-purple hover:text-purple-400 transition-colors"
      >
        LinkedIn
      </a>
      <span>|</span>

      <a
        href="https://github.com/pervejrony27"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyber-purple hover:text-purple-400 transition-colors"
      >
        GitHub
      </a>

      <span>|</span>

      <span>© {new Date().getFullYear()} AI-OSINT Dashboard</span>
    </p>
  </div>
</footer>>
    </div>
  );
}

export default App;