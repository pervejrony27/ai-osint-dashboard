import React from 'react';

const ScanProgress = () => {
  return (
    <div className="scan-progress p-4 bg-gray-100">
      <h2>Scan Progress</h2>
      <div className="progress-bar bg-blue-200 h-4 rounded">
        <div className="bg-blue-600 h-4 rounded" style={{ width: '50%' }}></div>
      </div>
    </div>
  );
};

export default ScanProgress;