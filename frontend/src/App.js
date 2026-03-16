import React from 'react';
import Header from './components/Header';
import ScanForm from './components/ScanForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <Header />
      <ScanForm />
      <Dashboard />
    </div>
  );
}

export default App;