import React from 'react';

const PortPanel = () => {
  return (
    <div className="panel p-4 border rounded">
      <h3>Open Ports</h3>
      <ul>
        <li>80 (http)</li>
        <li>443 (https)</li>
      </ul>
    </div>
  );
};

export default PortPanel;