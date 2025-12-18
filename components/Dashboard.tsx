
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { REGION_STATS, MOCK_CHART_DATA, PRIORITY_ACTIONS, IMPACT_STATS, STRATEGIC_KPI_TARGETS } from '../constants';
import { AlertTriangle, TrendingUp, Users, Truck, Activity, CheckSquare, ArrowRight, UserCheck, HeartCrack, Footprints, Target, Rocket, ShieldCheck } from 'lucide-react';
import AbstractMap from './LiveMap';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Strategic Vision Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-cyan-950/40 to-transparent p-6 rounded-2xl border border-cyan-500/10">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Strategic Mission Overview</h2>
          <p className="text-cyan-500/80 text-xs font-bold uppercase tracking-[0.2em] mt-1">Aura Intelligence • Actionable Real-time Intelligence for Humanitarian Aid</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Status</p>
              <p className="text-emerald-400 font-black text-sm uppercase">Operational • Phase 2 MVP</p>
           </div>
           <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center">
             <Rocket className="text-cyan-400 w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Strategic KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STRATEGIC_KPI_TARGETS.map((kpi, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border-t-4 border-t-cyan-500 relative overflow-hidden group">
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
                style={{width: `${Math.abs(kpi.current/kpi.target)*100}%`}}
               ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Critical Zones" 
          value="4" 
          change="+1" 
          changeType="bad"
          icon={<AlertTriangle className="text-red-500 w-6 h-6" />} 
        />
        <StatsCard 
          title="Aid Delivered (MT)" 
          value="1,240" 
          change="+15%" 
          changeType="good"
          icon={<Truck className="text-cyan-400 w-6 h-6" />} 
        />
        <StatsCard 
          title="Personnel Deployed" 
          value="342" 
          change="Stable" 
          changeType="neutral"
          icon={<Users className="text-emerald-400 w-6 h-6" />} 
        />
        <StatsCard 
          title="Avg Assessment Velocity" 
          value="2.8h" 
          change="-40%" 
          changeType="good"
          icon={<Activity className="text-purple-400 w-6 h-6" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <AbstractMap />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
               <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                 <TrendingUp className="w-5 h-5 text-cyan-400" /> Incident Frequency
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

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Strategic Actions
              </h3>
              <div className="space-y-4">
                {PRIORITY_ACTIONS.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                     <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                       item.urgency === 'Critical' ? 'bg-red-500' : 'bg-cyan-500'
                     }`} />
                     <div>
                       <p className="text-xs text-slate-200 leading-relaxed font-bold">{item.action}</p>
                       <span className="text-[9px] uppercase font-black tracking-widest mt-2 block text-slate-500">{item.urgency} Urgency</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter">Risk by Node</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={REGION_STATS} margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#475569" width={90} tick={{fontSize: 12, fontWeight: 700}} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                  />
                  <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={20}>
                    {REGION_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.riskScore > 90 ? '#ef4444' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 blur-3xl pointer-events-none"></div>
             <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tighter">Human Impact</h3>
             <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Affected PiN</p>
                      <p className="text-2xl font-black text-white tracking-tighter">{IMPACT_STATS.totalAffected}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reached</p>
                      <p className="text-2xl font-black text-emerald-400 tracking-tighter">{IMPACT_STATS.coverage}%</p>
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Displaced</p>
                      <p className="text-2xl font-black text-orange-400 tracking-tighter">{IMPACT_STATS.displaced}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fatalities</p>
                      <p className="text-2xl font-black text-rose-500 tracking-tighter">{IMPACT_STATS.casualties}</p>
                   </div>
                </div>
             </div>
             <button className="w-full py-4 mt-8 bg-slate-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-slate-800 transition-all">
                Full Impact Report <ArrowRight className="w-3 h-3 inline ml-1" />
             </button>
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
        {change} <span className="text-slate-600 font-medium ml-1">vs target</span>
      </div>
    </div>
  );
};

export default Dashboard;
