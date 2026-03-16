import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HiEnvelope,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";

const confidenceColors = {
  high: "text-green-400 bg-green-500/10",
  medium: "text-amber-400 bg-amber-500/10",
  low: "text-gray-400 bg-gray-500/10",
};

const EmailPanel = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const displayList = expanded ? data.emails : data.emails.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <HiEnvelope className="text-xl text-cyber-amber" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Email Addresses</h3>
            <p className="text-gray-500 text-xs">{data.scan_time}s</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-amber-400 mono">
          {data.total_found}
        </span>
      </div>

      <div className="p-5">
        {data.total_found === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No email addresses found
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {displayList.map((email, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-dark/50 hover:bg-cyber-dark transition-colors"
                >
                  <span className="text-sm text-gray-300 mono truncate mr-3">
                    {email.email}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-600 truncate max-w-[120px]">
                      {email.source}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        confidenceColors[email.confidence] ||
                        confidenceColors.medium
                      }`}
                    >
                      {email.confidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {data.emails.length > 8 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                {expanded ? (
                  <>
                    Show Less <HiChevronUp />
                  </>
                ) : (
                  <>
                    Show All ({data.emails.length}) <HiChevronDown />
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

export default EmailPanel;