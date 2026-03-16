import React from 'react';
import ScanProgress from './ScanProgress';
import SubdomainPanel from './SubdomainPanel';
import DnsPanel from './DnsPanel';
import PortPanel from './PortPanel';
import EmailPanel from './EmailPanel';
import BreachPanel from './BreachPanel';
import TechPanel from './TechPanel';
import RiskSummary from './RiskSummary';
import ExportButton from './ExportButton';

const Dashboard = () => {
  return (
    <div className="dashboard p-4">
      <ScanProgress />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SubdomainPanel />
        <DnsPanel />
        <PortPanel />
        <EmailPanel />
        <BreachPanel />
        <TechPanel />
      </div>
      <RiskSummary />
      <ExportButton />
    </div>
  );
};

export default Dashboard;