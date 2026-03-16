import React from "react";
import { motion } from "framer-motion";
import { HiCpuChip } from "react-icons/hi2";

const categoryIcons = {
  "Web Server": "🌐",
  CDN: "⚡",
  CMS: "📝",
  Framework: "🏗️",
  "Programming Language": "💻",
  "JavaScript Framework": "⚛️",
  "JavaScript Library": "📦",
  "CSS Framework": "🎨",
  Analytics: "📊",
  Security: "🔒",
  "Security Header": "🛡️",
  "E-Commerce": "🛒",
  Payment: "💳",
  "Build Tool": "🔧",
  "Icon Library": "✨",
  "Animation Library": "🎬",
};

const TechPanel = ({ data }) => {
  // Group by category
  const grouped = {};
  data.technologies.forEach((tech) => {
    if (!grouped[tech.category]) {
      grouped[tech.category] = [];
    }
    grouped[tech.category].push(tech);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-cyber-card rounded-xl glow-border overflow-hidden"
    >
      <div className="p-5 border-b border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <HiCpuChip className="text-xl text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Technology Stack</h3>
            <p className="text-gray-500 text-xs">{data.scan_time}s</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-blue-400 mono">
          {data.technologies.length}
        </span>
      </div>

      <div className="p-5">
        {data.technologies.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No technologies detected
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(grouped).map(([category, techs]) => (
              <div key={category}>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>{categoryIcons[category] || "📌"}</span>
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border ${
                        tech.confidence === "high"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                          : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                      }`}
                    >
                      {tech.name}
                      {tech.version && (
                        <span className="text-xs opacity-60 mono">
                          v{tech.version}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TechPanel;