import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiShieldExclamation, HiChevronDown } from "react-icons/hi2";

const BreachPanel = ({ data }) => {
  const [expandedBreach, setExpandedBreach] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <HiShieldExclamation className="text-xl text-cyber-red" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Data Breaches</h3>
            <p className="text-gray-500 text-xs">
              {data.scan_time}s •{" "}
              {data.total_records_exposed.toLocaleString()} records exposed
            </p>
          </div>
        </div>
        <span
          className={`text-2xl font-bold mono ${
            data.total_breaches > 0 ? "text-cyber-red" : "text-cyber-green"
          }`}
        >
          {data.total_breaches}
        </span>
      </div>

      <div className="p-5">
        {data.total_breaches === 0 ? (
          <div className="text-center py-4">
            <p className="text-cyber-green text-sm">
              ✓ No known breaches found for this domain
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {data.breaches.map((breach, i) => (
              <div
                key={i}
                className="rounded-lg bg-red-500/5 border border-red-500/10 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedBreach(expandedBreach === i ? null : i)
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-red-500/5 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">
                      {breach.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {breach.breach_date} •{" "}
                      {breach.pwn_count?.toLocaleString()} records
                    </p>
                  </div>
                  <HiChevronDown
                    className={`text-gray-500 transition-transform ${
                      expandedBreach === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedBreach === i && (
                  <div className="px-3 pb-3 border-t border-red-500/10">
                    {breach.description && (
                      <p className="text-xs text-gray-400 mt-2">
                        {breach.description}
                      </p>
                    )}
                    {breach.data_types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {breach.data_types.map((type, j) => (
                          <span
                            key={j}
                            className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BreachPanel;