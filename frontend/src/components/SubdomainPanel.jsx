import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiGlobeAlt, HiChevronDown, HiChevronUp } from "react-icons/hi2";

const SubdomainPanel = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const displayList = expanded
    ? data.subdomains
    : data.subdomains.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <HiGlobeAlt className="text-xl text-cyber-accent" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Subdomains</h3>
            <p className="text-gray-500 text-xs">
              {data.scan_time}s • Sources: {data.sources.join(", ")}
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-cyber-accent mono">
          {data.total_found}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {data.total_found === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No subdomains found
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {displayList.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-dark/50 hover:bg-cyber-dark transition-colors"
                >
                  <span className="text-sm text-gray-300 mono truncate mr-3">
                    {sub.subdomain}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub.ip_address && (
                      <span className="text-xs text-gray-500 mono">
                        {sub.ip_address}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {data.subdomains.length > 8 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-cyber-accent hover:text-cyber-glow transition-colors"
              >
                {expanded ? (
                  <>
                    Show Less <HiChevronUp />
                  </>
                ) : (
                  <>
                    Show All ({data.subdomains.length}) <HiChevronDown />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SubdomainPanel;