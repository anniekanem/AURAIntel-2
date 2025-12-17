
import React, { useState } from 'react';
import { MOCK_ALERTS } from '../constants';
import { AlertTriangle, Radio, Mail, MessageSquare, CheckCircle, XCircle, Bell, Filter } from 'lucide-react';
import { Alert } from '../types';

const AlertsCenter = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'High'>('All');
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    sms: true,
    email: true,
    inApp: true
  });

  const handleStatusChange = (id: string, newStatus: 'Acknowledged' | 'Resolved') => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const filteredAlerts = alerts.filter(a => filter === 'All' ? true : a.severity === filter);

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500 w-7 h-7" /> Alert Control Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time emergency triggers and notification management.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-700 overflow-x-auto w-full md:w-auto">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filter === 'All' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            All Alerts
          </button>
          <button 
             onClick={() => setFilter('Critical')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filter === 'Critical' ? 'bg-red-900/40 text-red-400 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Critical Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        {/* Main Alert List */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar min-h-[400px]">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`
                relative p-5 md:p-6 rounded-xl border backdrop-blur-sm transition-all
                ${alert.status === 'Resolved' ? 'bg-slate-900/30 border-slate-800 opacity-60' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'}
                ${alert.severity === 'Critical' && alert.status !== 'Resolved' ? 'shadow-[0_0_15px_rgba(239,68,68,0.15)] border-red-900/30' : ''}
              `}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="flex gap-5">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center shrink-0
                    ${alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 
                      alert.severity === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'}
                  `}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg flex flex-wrap items-center gap-3">
                      {alert.title}
                      <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded border
                        ${alert.severity === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                          alert.severity === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 
                          'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}
                      `}>
                        {alert.severity}
                      </span>
                    </h3>
                    <p className="text-slate-300 text-base mt-2 leading-relaxed">{alert.message}</p>
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-3 text-sm text-slate-500 font-medium">
                      <span>Via: {alert.source}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{alert.timestamp}</span>
                      {alert.status === 'Resolved' && <span className="text-emerald-500 font-bold ml-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto md:flex-col pt-2 md:pt-0">
                   {alert.status === 'New' && (
                     <button 
                       onClick={() => handleStatusChange(alert.id, 'Acknowledged')}
                       className="flex-1 md:flex-none px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-900/20"
                     >
                       <CheckCircle className="w-4 h-4" /> Acknowledge
                     </button>
                   )}
                   {alert.status !== 'Resolved' && (
                     <button 
                       onClick={() => handleStatusChange(alert.id, 'Resolved')}
                       className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700"
                     >
                       <XCircle className="w-4 h-4" /> Resolve
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Notification Channels
            </h3>
            <div className="space-y-4">
              <ToggleRow 
                icon={<MessageSquare className="w-5 h-5" />} 
                label="SMS Alerts" 
                active={notificationsEnabled.sms} 
                onClick={() => setNotificationsEnabled(p => ({...p, sms: !p.sms}))} 
              />
              <ToggleRow 
                icon={<Mail className="w-5 h-5" />} 
                label="Email Digest" 
                active={notificationsEnabled.email} 
                onClick={() => setNotificationsEnabled(p => ({...p, email: !p.email}))} 
              />
              <ToggleRow 
                icon={<Bell className="w-5 h-5" />} 
                label="In-App Push" 
                active={notificationsEnabled.inApp} 
                onClick={() => setNotificationsEnabled(p => ({...p, inApp: !p.inApp}))} 
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border-t-2 border-slate-700">
             <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Trigger Logic</h3>
             <ul className="space-y-4 text-sm text-slate-400">
               <li className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                 <span><strong>Sudden Displacement:</strong> {'>'}1,000 people moving within 1 hour timeframe.</span>
               </li>
               <li className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                 <span><strong>Resource Shortage:</strong> Stock levels dip below 3 days of supply in critical zones.</span>
               </li>
               <li className="flex gap-3">
                 <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                 <span><strong>Weather:</strong> Severe storm path intersecting with camp coordinates.</span>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ icon, label, active, onClick }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3 text-slate-300">
      {icon}
      <span className="text-base font-medium">{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-cyan-600' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);

export default AlertsCenter;
