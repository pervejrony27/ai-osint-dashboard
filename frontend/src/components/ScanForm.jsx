import React, { useState } from "react";
import { HiMagnifyingGlass, HiGlobeAlt } from "react-icons/hi2";
import { motion } from "framer-motion";

const ScanForm = ({ onScan, scanning }) => {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      onScan(domain);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Discover Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-purple">
            Digital Footprint
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Enter a domain to run a comprehensive OSINT analysis. Discover
          exposed subdomains, open ports, leaked emails, data breaches, and
          get an AI-powered risk assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-accent to-cyber-purple rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

          <div className="relative flex items-center bg-cyber-dark rounded-xl border border-cyber-border overflow-hidden">
            <div className="pl-4 text-gray-500">
              <HiGlobeAlt className="text-xl" />
            </div>

            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter target domain (e.g. example.com)"
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-600 outline-none text-lg mono"
              disabled={scanning}
            />

            <button
              type="submit"
              disabled={scanning || !domain.trim()}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                scanning
                  ? "bg-cyber-accent/20 text-cyber-accent cursor-not-allowed"
                  : "bg-cyber-accent text-cyber-dark hover:bg-cyber-glow"
              }`}
            >
              {scanning ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Scanning
                </>
              ) : (
                <>
                  <HiMagnifyingGlass className="text-lg" />
                  Scan
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-gray-600">Try:</span>
          {["tesla.com", "shopify.com", "github.com"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d)}
              className="text-xs px-3 py-1 rounded-full border border-cyber-border text-gray-500 hover:text-cyber-accent hover:border-cyber-accent/50 transition-colors mono"
            >
              {d}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
};

export default ScanForm;