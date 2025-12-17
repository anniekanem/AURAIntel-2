
import React, { useState } from 'react';
import { View } from '../types';
import { LayoutDashboard, Radio, Map, FileBarChart2, Bell, Search, User, BarChart3, Database, AlertCircle, Menu, X } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
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
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2 px-4">Core</div>
          <NavItem 
            active={currentView === View.DASHBOARD} 
            onClick={() => handleNavClick(View.DASHBOARD)}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Overview"
          />
          <NavItem 
            active={currentView === View.MAP} 
            onClick={() => handleNavClick(View.MAP)}
            icon={<Map className="w-5 h-5" />}
            label="Geospatial"
          />
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">Intelligence</div>
          <NavItem 
            active={currentView === View.ANALYSIS} 
            onClick={() => handleNavClick(View.ANALYSIS)}
            icon={<FileBarChart2 className="w-5 h-5" />}
            label="Intel Analysis"
          />
          <NavItem 
            active={currentView === View.PERFORMANCE} 
            onClick={() => handleNavClick(View.PERFORMANCE)}
            icon={<BarChart3 className="w-5 h-5" />}
            label="KPI Monitoring"
          />

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-4">System</div>
          <NavItem 
            active={currentView === View.ALERTS} 
            onClick={() => handleNavClick(View.ALERTS)}
            icon={<AlertCircle className="w-5 h-5" />}
            label="Alert Center"
            badge="3"
            alert
          />
          <NavItem 
            active={currentView === View.DATA} 
            onClick={() => handleNavClick(View.DATA)}
            icon={<Database className="w-5 h-5" />}
            label="Data Pipeline"
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="glass-panel p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Field Coordinator</p>
              <p className="text-xs text-emerald-400">● Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        {/* Header */}
        <header className="h-18 md:h-20 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
             >
               <Menu className="w-7 h-7" />
             </button>
             <div className="flex items-center text-sm md:text-base">
                <button 
                  onClick={() => handleNavClick(View.DASHBOARD)}
                  className="hidden md:inline mr-2 text-slate-400 hover:text-cyan-400 font-semibold transition-colors focus:outline-none px-2 py-1 rounded hover:bg-slate-800"
                  title="Return to Dashboard"
                >
                  Operations
                </button>
                <span className="hidden md:inline text-slate-600 mr-2">/</span>
                <span className="text-white ml-0 md:ml-0 font-medium capitalize text-lg tracking-wide">{currentView.toLowerCase().replace('_', ' ')}</span>
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-900 border border-slate-700 rounded-full px-5 py-2.5 pl-11 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none w-48 transition-all focus:w-72 lg:w-96 placeholder:text-slate-600"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            </div>
             <button className="md:hidden text-slate-400 p-2">
               <Search className="w-6 h-6" />
             </button>
            <button 
              onClick={() => handleNavClick(View.ALERTS)}
              className="relative text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[#0f172a]"></span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, badge, alert }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-gradient-to-r from-cyan-900/40 to-cyan-900/10 text-cyan-400 border-l-4 border-cyan-400' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-l-4 border-transparent'}
    `}
  >
    <div className="flex items-center gap-3">
      {React.cloneElement(icon, { className: `w-5 h-5 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}` })}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className={`${alert ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-700 text-slate-300'} text-xs font-bold px-2.5 py-0.5 rounded-full`}>
        {badge}
      </span>
    )}
  </button>
);

export default Layout;
