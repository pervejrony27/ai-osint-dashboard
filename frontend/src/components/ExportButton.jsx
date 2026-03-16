import React from 'react';

const ExportButton = () => {
  const handleExport = () => {
    // Handle export functionality
    console.log('Exporting data...');
  };

  return (
    <button onClick={handleExport} className="bg-green-500 text-white p-2 m-4">
      Export Results
    </button>
  );
};

export default ExportButton;