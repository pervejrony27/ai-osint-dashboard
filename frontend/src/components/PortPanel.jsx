import React from "react";
import { motion } from "framer-motion";
import { HiSignal } from "react-icons/hi2";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#a855f7",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
];

const riskPorts = new Set([
  21, 23, 445, 3389, 5900, 6379, 27017, 1433, 1521,
]);

const PortPanel = ({ data }) => {
  const chartData = data.ports.map((p) => ({
    name: `${p.port}/${p.service}`,
    value: 1,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <HiSignal className="text-xl text-cyber-green" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              Open Ports & Services
            </h3>
            <p className="text-gray-500 text-xs">
              {data.scan_time}s • Source: {data.source} • IP:{" "}
              {data.ip_address}
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-cyber-green mono">
          {data.total_open}
        </span>
      </div>

      <div className="p-5">
        {data.total_open === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No open ports detected
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Ports list */}
            <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
              {data.ports.map((port, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2.5 rounded-lg ${
                    riskPorts.has(port.port)
                      ? "bg-red-500/5 border border-red-500/20"
                      : "bg-cyber-dark/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold mono text-white w-14">
                      {port.port}
                    </span>
                    <span className="text-sm text-gray-400">
                      {port.service}
                    </span>
                    {port.version && (
                      <span className="text-xs text-gray-600 mono">
                        v{port.version}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {riskPorts.has(port.port) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        RISKY
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                      {port.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie chart */}
            {chartData.length > 0 && chartData.length <= 20 && (
              <div className="w-full lg:w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PortPanel;