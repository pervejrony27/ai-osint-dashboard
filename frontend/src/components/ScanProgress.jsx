import React from "react";
import { motion } from "framer-motion";
import {
  HiCheck,
  HiXMark,
  HiArrowPath,
  HiClock,
} from "react-icons/hi2";

const statusConfig = {
  pending: {
    icon: HiClock,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    label: "Pending",
  },
  running: {
    icon: HiArrowPath,
    color: "text-cyber-accent",
    bg: "bg-cyber-accent/10",
    label: "Running",
    animate: true,
  },
  completed: {
    icon: HiCheck,
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
    label: "Done",
  },
  error: {
    icon: HiXMark,
    color: "text-cyber-red",
    bg: "bg-cyber-red/10",
    label: "Error",
  },
};

const ScanProgress = ({ modules, status, domain }) => {
  const completedCount = Object.values(status).filter(
    (s) => s === "completed"
  ).length;
  const totalCount = Object.keys(status).length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 bg-cyber-card rounded-xl glow-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">
            Scanning:{" "}
            <span className="text-cyber-accent mono">{domain}</span>
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {completedCount}/{totalCount} modules completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-cyber-dark rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-accent to-cyber-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Module status grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {modules.map((mod) => {
          const s = status[mod.key] || "pending";
          const config = statusConfig[s];
          const Icon = config.icon;

          return (
            <div
              key={mod.key}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg ${config.bg} border border-transparent transition-all duration-300`}
            >
              <Icon
                className={`text-xl ${config.color} ${
                  config.animate ? "animate-spin" : ""
                }`}
              />
              <span className="text-xs font-medium text-gray-400 text-center">
                {mod.label}
              </span>
              <span className={`text-xs ${config.color}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ScanProgress;