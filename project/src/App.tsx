import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Dashboard />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;