import React, { useState, useEffect } from 'react';
import { DATA_SOURCES } from '../constants';
import { Database, Satellite, FileText, Globe, RefreshCcw, Check, AlertCircle, ArrowRight } from 'lucide-react';

const DataIngestion = () => {
  const [sources, setSources] = useState(DATA_SOURCES);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulate live ingestion logs
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        "Validating Sentinel-2 Batch #8942...",
        "Syncing KoBoToolbox forms (Delta: 14)...",
        "GDACS API Poll: No new events.",
        "Normalizing weather data format...",
        "Error: Connection timeout [Station 4]..."
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [`[${time}] ${randomAction}`, ...prev].slice(0, 8));
      
      // Randomly toggle syncing status
      setSources(prev => prev.map(s => 
        Math.random() > 0.8 ? { ...s, status: s.status === 'Syncing' ? 'Active' : 'Syncing' } : s
      ));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Syncing': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Satellite': return <Satellite className="w-5 h-5" />;
      case 'Field': return <FileText className="w-5 h-5" />;
      case 'OpenSource': return <Globe className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Data Ingestion Pipeline</h2>
           <p className="text-slate-400 text-sm mt-1">Status of connected intelligence feeds and validation layers.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors shadow-lg shadow-cyan-900/20">
             <RefreshCcw className="w-3 h-3" /> <span className="hidden md:inline">Force Sync</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Source List */}
        <div className="lg:col-span-2 space-y-4">
           {sources.map(source => (
             <div key={source.id} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-slate-800/50 transition-colors gap-4">
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0">
                    {getTypeIcon(source.type)}
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-200">{source.name}</h3>
                   <div className="flex gap-3 text-xs text-slate-500 mt-1">
                     <span>Last Ingest: {source.lastIngest}</span>
                     <span>•</span>
                     <span>{source.recordsProcessed} Records</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex items-center justify-between w-full md:w-auto gap-6 pl-16 md:pl-0">
                 {/* Visual Pipeline Animation */}
                 <div className="hidden md:flex items-center gap-2 opacity-30">
                   <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                   <div className="w-12 h-0.5 bg-gradient-to-r from-slate-500 to-transparent" />
                   <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75" />
                   <div className="w-12 h-0.5 bg-gradient-to-r from-slate-500 to-transparent" />
                   <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150" />
                 </div>

                 <div className={`px-3 py-1 rounded border text-xs font-bold flex items-center gap-2 min-w-[100px] justify-center ${getStatusColor(source.status)}`}>
                   {source.status === 'Syncing' && <RefreshCcw className="w-3 h-3 animate-spin" />}
                   {source.status === 'Active' && <Check className="w-3 h-3" />}
                   {source.status === 'Error' && <AlertCircle className="w-3 h-3" />}
                   {source.status}
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Live Logs & Pipeline Diagram */}
        <div className="space-y-6">
          <div className="glass-panel p-4 md:p-6 rounded-xl min-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Live Validation Log
            </h3>
            <div className="flex-1 font-mono text-xs space-y-3 overflow-hidden">
               {logs.map((log, i) => (
                 <div key={i} className="flex gap-2 animate-in slide-in-from-left-2 fade-in duration-300">
                   <span className="text-cyan-500/50 select-none">{'>'}</span>
                   <span className={log.includes('Error') ? 'text-red-400' : 'text-slate-400'}>{log}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-panel p-4 md:p-6 rounded-xl hidden md:block">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pipeline Architecture</h3>
             <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded border border-slate-600 flex items-center justify-center bg-slate-800">In</div>
                 <span>Source</span>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-600" />
               <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded border border-cyan-600/50 flex items-center justify-center bg-cyan-900/20 text-cyan-400">AI</div>
                 <span>Clean</span>
               </div>
               <ArrowRight className="w-4 h-4 text-slate-600" />
               <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded border border-slate-600 flex items-center justify-center bg-slate-800">DB</div>
                 <span>Store</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataIngestion;