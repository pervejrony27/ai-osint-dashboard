import React from "react";
import { motion } from "framer-motion";
import SubdomainPanel from "./SubdomainPanel";
import DnsPanel from "./DnsPanel";
import PortPanel from "./PortPanel";
import EmailPanel from "./EmailPanel";
import BreachPanel from "./BreachPanel";
import TechPanel from "./TechPanel";
import RiskSummary from "./RiskSummary";
import ExportButton from "./ExportButton";

const Dashboard = ({ domain, results, moduleStatus }) => {
  const hasAnyResult = Object.keys(results).length > 0;

  if (!hasAnyResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Risk Summary at the top */}
      {results.summary && (
        <RiskSummary data={results.summary} />
      )}

      {/* Export button */}
      {moduleStatus.summary === "completed" && (
        <div className="flex justify-end mb-6">
          <ExportButton domain={domain} results={results} />
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {results.subdomains && (
          <SubdomainPanel data={results.subdomains} />
        )}
        {results.dns && <DnsPanel data={results.dns} />}
        {results.ports && <PortPanel data={results.ports} />}
        {results.emails && <EmailPanel data={results.emails} />}
        {results.breaches && <BreachPanel data={results.breaches} />}
        {results.tech && <TechPanel data={results.tech} />}
      </div>
    </motion.div>
  );
};

export default Dashboard;