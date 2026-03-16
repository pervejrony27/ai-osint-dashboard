import React, { useState } from 'react';

const ScanForm = () => {
  const [target, setTarget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle scan submission
    console.log('Scanning:', target);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter target domain"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Scan</button>
    </form>
  );
};

export default ScanForm;