import React from "react";
import { motion } from "framer-motion";
import { HiServerStack } from "react-icons/hi2";

const typeColors = {
  A: "bg-blue-500/20 text-blue-400",
  AAAA: "bg-indigo-500/20 text-indigo-400",
  MX: "bg-purple-500/20 text-purple-400",
  NS: "bg-green-500/20 text-green-400",
  TXT: "bg-amber-500/20 text-amber-400",
  CNAME: "bg-cyan-500/20 text-cyan-400",
  SOA: "bg-red-500/20 text-red-400",
  SRV: "bg-pink-500/20 text-pink-400",
};

const DnsPanel = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <HiServerStack className="text-xl text-cyber-purple" />
          </div>
          <div>
            <h3 className="text-white font-semibold">DNS Records</h3>
            <p className="text-gray-500 text-xs">{data.scan_time}s</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-cyber-purple mono">
          {data.records.length}
        </span>
      </div>

      <div className="p-5">
        {data.records.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No DNS records found
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.records.map((record, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-cyber-dark/50"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-semibold shrink-0 ${
                    typeColors[record.record_type] ||
                    "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {record.record_type}
                </span>
                <span className="text-sm text-gray-300 mono break-all">
                  {record.value}
                </span>
                {record.ttl && (
                  <span className="text-xs text-gray-600 shrink-0">
                    TTL: {record.ttl}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {data.nameservers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cyber-border">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Nameservers
            </p>
            <div className="flex flex-wrap gap-2">
              {data.nameservers.map((ns, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded bg-cyber-dark mono text-gray-400"
                >
                  {ns}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DnsPanel;