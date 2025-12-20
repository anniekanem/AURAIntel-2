
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, Map, FileBarChart2, Bell, Search, User, 
  BarChart3, Database, AlertCircle, Menu, X, Library, Key, Wifi, WifiOff, CloudDownload
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkKey = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        try {
          const selected = await aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("Key check failed", e);
        }
      }
    };
    checkKey();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  const getViewDisplayName = (view: View) => {
    switch(view) {
      case View.DASHBOARD: return "Operational Overview";
      case View.ANALYSIS: return "Predictive Intel Node";
      case View.MAP: return "Geospatial Matrix";
      case View.REPORTS: return "Intelligence Archive";
      case View.PERFORMANCE: return "Impact Metrics";
      case View.ALERTS: return "Emerging Threats";
      case View.DATA: return "Telemetry Streams";
      default: return String(view);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col transition-transform duration-300 transform
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-bold text-white text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Aura<span className="text-cyan-500">Intel</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 mt-2 px-4">Force Multipliers</div>
          <NavItem active={currentView === View.DASHBOARD} onClick={() => handleNavClick(View.DASHBOARD)} icon={<LayoutDashboard className="w-5 h-5" />} label="Mission Pulse" />
          <NavItem active={currentView === View.MAP} onClick={() => handleNavClick(View.MAP)} icon={<Map className="w-5 h-5" />} label="Geospatial Matrix" />
          
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">Predictive Analytics</div>
          <NavItem active={currentView === View.ANALYSIS} onClick={() => handleNavClick(View.ANALYSIS)} icon={<FileBarChart2 className="w-5 h-5" />} label="Intelligence Node" />
          <NavItem active={currentView === View.REPORTS} onClick={() => handleNavClick(View.REPORTS)} icon={<Library className="w-5 h-5" />} label="Strategic Archive" />
          <NavItem active={currentView === View.PERFORMANCE} onClick={() => handleNavClick(View.PERFORMANCE)} icon={<BarChart3 className="w-5 h-5" />} label="Impact Forecasting" />

          <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">Autonomous Systems</div>
          <NavItem active={currentView === View.ALERTS} onClick={() => handleNavClick(View.ALERTS)} icon={<AlertCircle className="w-5 h-5" />} label="Emerging Threats" badge="3" alert />
          <NavItem active={currentView === View.DATA} onClick={() => handleNavClick(View.DATA)} icon={<Database className="w-5 h-5" />} label="Telemetry" />
        </nav>

        {/* Aura Platform Identity */}
        <div className="mx-4 mb-4 p-4 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl">
           <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Mission Differentiator</p>
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
             From reactive reporting to proactive intelligence. Aura integrates field data with AI-driven telemetry.
           </p>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="glass-panel p-3 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-white leading-none">Field Officer</p>
                <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mt-1">Ready</p>
              </div>
            </div>
            {isOnline ? (
               <div title="Online - Cloud Syncing" className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"><Wifi className="w-3 h-3" /></div>
            ) : (
               <div title="Offline Mode - Using Local Cache" className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg flex items-center gap-1.5 px-2">
                 <WifiOff className="w-3 h-3" />
                 <span className="text-[8px] font-black">OFFLINE</span>
               </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        <header className="h-18 md:h-20 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg">
               <Menu className="w-7 h-7" />
             </button>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Humanitarian Intelligence Node</span>
                <span className="text-white font-black uppercase text-lg tracking-tight">{getViewDisplayName(currentView)}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
               <CloudDownload className="w-3.5 h-3.5 text-cyan-500" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Offline Database: 100% Synced</span>
            </div>

            <button 
              onClick={handleSelectKey}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${hasKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg' : 'bg-cyan-600 text-white shadow-xl shadow-cyan-900/30'}`}
            >
              <Key className="w-3.5 h-3.5" />
              {hasKey ? 'Secure Key' : 'API Key'}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, badge, alert }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-gradient-to-r from-cyan-900/40 to-cyan-900/5 text-cyan-400 border-l-4 border-cyan-500 shadow-xl shadow-black/20' : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-l-4 border-transparent'}`}>
    <div className="flex items-center gap-3">
      {React.cloneElement(icon, { className: `w-5 h-5 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}` })}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {badge && <span className={`${alert ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-700 text-slate-300'} text-[10px] font-black px-2 py-0.5 rounded-full`}>{badge}</span>}
  </button>
);

export default Layout;
