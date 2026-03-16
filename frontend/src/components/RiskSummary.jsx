import React from "react";
import { motion } from "framer-motion";
import { HiBolt } from "react-icons/hi2";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const riskColors = {
  critical: { color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/30" },
  high: { color: "#f97316", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  medium: { color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  low: { color: "#22c55e", bg: "bg-green-500/10", border: "border-green-500/30" },
};

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

const RiskSummary = ({ data }) => {
  const config = riskColors[data.risk_level] || riskColors.medium;

  const gaugeData = [
    {
      name: "Risk",
      value: data.risk_score,
      fill: config.color,
    },
  ];

  const sortedFindings = [...(data.findings || [])].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 rounded-xl ${config.bg} border ${config.border} overflow-hidden`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Risk gauge */}
          <div className="w-40 h-40 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={180}
                endAngle={0}
                data={gaugeData}
              >
                <RadialBar
                  background={{ fill: "#1e293b" }}
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{ color: config.color }}
              >
                {data.risk_score}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          {/* Summary text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <HiBolt className="text-xl" style={{ color: config.color }} />
              <h3 className="text-xl font-bold text-white">
                Risk Level:{" "}
                <span style={{ color: config.color }} className="uppercase">
                  {data.risk_level}
                </span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {data.executive_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Findings */}
      {sortedFindings.length > 0 && (
        <div className="p-6 border-b border-white/5">
          <h4 className="text-white font-semibold mb-4">
            Key Findings ({sortedFindings.length})
          </h4>
          <div className="space-y-3">
            {sortedFindings.map((finding, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-black/20"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5 badge-${finding.severity}`}
                >
                  {finding.severity.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm text-white">{finding.finding}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ↳ {finding.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="p-6">
          <h4 className="text-white font-semibold mb-3">
            Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-400"
              >
                <span className="text-cyber-accent shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RiskSummary;