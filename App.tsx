import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AnalysisTool from './components/AnalysisTool';
import AbstractMap from './components/LiveMap';
import PerformanceDashboard from './components/PerformanceDashboard';
import AlertsCenter from './components/AlertsCenter';
import DataIngestion from './components/DataIngestion';
import { View } from './types';

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.ANALYSIS:
        return <AnalysisTool />;
      case View.PERFORMANCE:
        return <PerformanceDashboard />;
      case View.ALERTS:
        return <AlertsCenter />;
      case View.DATA:
        return <DataIngestion />;
      case View.MAP:
        // Reusing the map component but as a full view page
        return (
          <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex justify-between items-end">
               <div>
                  <h2 className="text-2xl font-bold text-white">Geospatial Intelligence</h2>
                  <p className="text-slate-400 text-sm mt-1">Real-time tracking of conflict zones and humanitarian corridors.</p>
               </div>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-slate-800 text-xs rounded text-slate-300 border border-slate-700 hover:bg-slate-700">Filter: All Incidents</button>
                 <button className="px-3 py-1 bg-slate-800 text-xs rounded text-slate-300 border border-slate-700 hover:bg-slate-700">Layer: Supply Routes</button>
               </div>
            </div>
            <div className="flex-1 glass-panel rounded-xl overflow-hidden p-1 border border-slate-700">
               <AbstractMap />
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
