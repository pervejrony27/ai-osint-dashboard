import React from "react";
import { HiShieldCheck } from "react-icons/hi2";

const Header = () => {
  return (
    <header className="border-b border-cyber-border bg-cyber-darker/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiShieldCheck className="text-4xl text-cyber-accent" />
              <div className="absolute inset-0 text-4xl text-cyber-accent blur-lg opacity-50">
                <HiShieldCheck />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                OSINT <span className="text-cyber-accent">Dashboard</span>
              </h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase">
                AI-Powered Intelligence Gathering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-green/10 border border-cyber-green/30">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              <span className="text-cyber-green text-xs font-medium">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;