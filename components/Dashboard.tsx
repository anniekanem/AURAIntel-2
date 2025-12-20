
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { REGION_STATS, MOCK_CHART_DATA, PRIORITY_ACTIONS, IMPACT_STATS } from '../constants';
import { AlertTriangle, TrendingUp, Users, Truck, Activity, ArrowRight, Target, Rocket, ShieldCheck, FileText, Clock, Archive, Sparkles } from 'lucide-react';
import AbstractMap from './LiveMap';
import { SavedReport } from '../types';

const STRATEGIC_AURA_TARGETS = [
  { label: 'Security Incident Reduction', current: -14.2, target: -15.0, suffix: '%', desc: 'Predictive risk mitigation' },
  { label: 'Aid Delivery Velocity', current: 18.5, target: 20.0, suffix: '%', desc: 'Optimized logistics paths' },
  { label: 'Situational Assessment Time', current: -38.2, target: -40.0, suffix: '%', desc: 'Autonomous intelligence cycle' }
];

const Dashboard = () => {
  const [recentReports, setRecentReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('aura_reports_history') || '[]');
    setRecentReports(history.slice(0, 3));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Strategic Vision Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-cyan-950/40 to-transparent p-6 rounded-2xl border border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Predictive Intelligence Overview</h2>
          </div>
          <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em]">Force Multiplier Active • Proactive Decision Posture</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Sync</p>
              <p className="text-emerald-400 font-black text-sm uppercase">Full Telemetry • Offline Ready</p>
           </div>
           <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center">
             <Rocket className="text-cyan-400 w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Strategic KPI Row - Matching Video Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STRATEGIC_AURA_TARGETS.map((kpi, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border-t-4 border-t-cyan-500 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Target className="w-16 h-16 text-white" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mb-2">
               <h4 className="text-4xl font-black text-white tracking-tighter">{kpi.current}{kpi.suffix}</h4>
               <span className="text-cyan-500 font-bold text-sm">/ {kpi.target}{kpi.suffix} Target</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{kpi.desc}</p>
            <div className="w-full bg-slate-900 h-1.5 mt-6 rounded-full overflow-hidden">
               <div 
                className="bg-cyan-500 h-full rounded-full transition-all duration-1000" 
                style={{width: `${Math.min(Math.abs((kpi.current / kpi.target) * 100), 100)}%`}}
               ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Telemetry Streams Active" 
          value="12" 
          change="Satellite + Field" 
          changeType="neutral"
          icon={<Activity className="text-cyan-400 w-6 h-6" />} 
        />
        <StatsCard 
          title="Security Incidents (24h)" 
          value="4" 
          change="-2" 
          changeType="good"
          icon={<AlertTriangle className="text-red-500 w-6 h-6" />} 
        />
        <StatsCard 
          title="Safe Corridors Identified" 
          value="8" 
          change="+3" 
          changeType="good"
          icon={<ShieldCheck className="text-emerald-400 w-6 h-6" />} 
        />
        <StatsCard 
          title="Predictive Cycle Time" 
          value="15m" 
          change="Real-time" 
          changeType="neutral"
          icon={<Clock className="text-purple-400 w-6 h-6" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <AbstractMap />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl shadow-xl">
               <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                 <TrendingUp className="w-5 h-5 text-cyan-400" /> Emerging Threat Flux
               </h3>
               <div className="h-56 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={MOCK_CHART_DATA}>
                     <defs>
                       <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#00aaff" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#00aaff" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="name" stroke="#475569" fontSize={10} tickMargin={10} axisLine={false} />
                     <YAxis stroke="#475569" fontSize={10} width={30} axisLine={false} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="incidents" stroke="#00aaff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500 shadow-xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Proactive Directives
              </h3>
              <div className="space-y-4">
                {PRIORITY_ACTIONS.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5 group hover:bg-slate-800 transition-colors">
                     <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                       item.urgency === 'Critical' ? 'bg-red-500' : 'bg-cyan-500'
                     }`} />
                     <div>
                       <p className="text-xs text-slate-200 leading-relaxed font-bold group-hover:text-white transition-colors">{item.action}</p>
                       <span className="text-[9px] uppercase font-black tracking-widest mt-2 block text-slate-500">{item.urgency} Priority</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 blur-3xl pointer-events-none"></div>
             <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> Strategic Intelligence
             </h3>
             <div className="space-y-4">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <div key={report.reportId} className="p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                            report.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                          }`}>{report.riskLevel}</span>
                          <span className="text-[8px] text-slate-500 font-black flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {new Date(report.timestamp).toLocaleDateString()}
                          </span>
                       </div>
                       <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase truncate">{report.title}</h4>
                       <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{report.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Archive className="w-10 h-10 text-slate-800 mx-auto mb-3" />
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">Archive Standby</p>
                  </div>
                )}
             </div>
             <button className="w-full py-4 mt-6 bg-slate-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-slate-800 transition-all shadow-lg">
                Access Library <ArrowRight className="w-3 h-3 inline ml-1" />
             </button>
          </div>

          <div className="glass-panel p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter">Threat Density Index</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={REGION_STATS} margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#475569" width={90} tick={{fontSize: 12, fontWeight: 700}} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                  />
                  <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={16}>
                    {REGION_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.riskScore > 90 ? '#ef4444' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, changeType, icon }: any) => {
  const getChangeColor = () => {
    if (changeType === 'good') return 'text-emerald-400';
    if (changeType === 'bad') return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl hover:bg-slate-800/80 transition-all border border-white/5 group shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <h4 className="text-3xl font-black text-white tracking-tighter mb-2">{value}</h4>
      <div className={`text-[10px] font-black uppercase tracking-widest ${getChangeColor()}`}>
        {change}
      </div>
    </div>
  );
};

export default Dashboard;
