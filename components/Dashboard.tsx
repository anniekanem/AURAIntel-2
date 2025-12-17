
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { REGION_STATS, MOCK_CHART_DATA, PRIORITY_ACTIONS, IMPACT_STATS } from '../constants';
import { AlertTriangle, TrendingUp, Users, Truck, Activity, CheckSquare, ArrowRight, UserCheck, HeartCrack, Footprints } from 'lucide-react';
import AbstractMap from './LiveMap';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Critical Zones" 
          value="8" 
          change="+2" 
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
          title="Avg Response Time" 
          value="4h 12m" 
          change="-25m" 
          changeType="good"
          icon={<Activity className="text-purple-400 w-6 h-6" />} 
        />
      </div>

      {/* Human Impact Section */}
      <div className="glass-panel p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-rose-900/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Users className="text-cyan-400 w-6 h-6" />
          <h3 className="text-xl font-semibold text-white">Population Impact & Response</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Total Affected */}
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
             <p className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2 mb-2">
               Total Affected
             </p>
             <div className="flex items-end gap-2">
               <span className="text-3xl font-bold text-white leading-none">{IMPACT_STATS.totalAffected}</span>
               <span className="text-xs text-rose-400 font-medium bg-rose-900/20 px-2 py-0.5 rounded border border-rose-900/30">In Need</span>
             </div>
          </div>

          {/* People Served */}
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
             <p className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2 mb-2">
               Population Reached
             </p>
             <div className="flex items-end gap-2 justify-between">
               <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white leading-none">{IMPACT_STATS.populationReached}</span>
                  <UserCheck className="w-5 h-5 text-emerald-400 mb-0.5" />
               </div>
               <span className="text-sm text-emerald-400 font-bold">{IMPACT_STATS.coverage}%</span>
             </div>
             <div className="w-full bg-slate-700 h-2 mt-4 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full rounded-full" style={{width: `${IMPACT_STATS.coverage}%`}}></div>
             </div>
          </div>

          {/* Displaced */}
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
             <p className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2 mb-2">
               Internally Displaced
             </p>
             <div className="flex items-end gap-2">
               <span className="text-3xl font-bold text-white leading-none">{IMPACT_STATS.displaced}</span>
               <Footprints className="w-5 h-5 text-orange-400 mb-0.5" />
             </div>
             <p className="text-xs text-slate-500 mt-2">Seeking Shelter</p>
          </div>

          {/* Casualties */}
          <div className="bg-rose-950/10 p-5 rounded-lg border border-rose-900/20">
             <p className="text-rose-400/80 text-xs font-bold uppercase flex items-center gap-2 mb-2">
               Casualties
             </p>
             <div className="flex items-end gap-2">
               <span className="text-3xl font-bold text-white leading-none">{IMPACT_STATS.casualties}</span>
               <HeartCrack className="w-5 h-5 text-rose-500 mb-0.5" />
             </div>
             <p className="text-xs text-rose-300/60 mt-2">{IMPACT_STATS.injured} Injured</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <AbstractMap />
          
          <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-cyan-400" /> Incident Frequency (7 Days)
             </h3>
             <div className="h-64 md:h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_CHART_DATA}>
                   <defs>
                     <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#00aaff" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#00aaff" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                   <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                   <YAxis stroke="#94a3b8" fontSize={12} width={30} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                     itemStyle={{ color: '#e2e8f0' }}
                   />
                   <Area type="monotone" dataKey="incidents" stroke="#00aaff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Strategic Recommendations from PDF */}
          <div className="glass-panel p-6 rounded-xl border-l-4 border-emerald-500">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" /> Priority Actions & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIORITY_ACTIONS.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                   <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                     item.urgency === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                     item.urgency === 'High' ? 'bg-orange-500' : 'bg-cyan-500'
                   }`} />
                   <div>
                     <p className="text-sm md:text-base text-slate-200 leading-snug">{item.action}</p>
                     <span className={`text-xs uppercase font-bold mt-2 inline-block ${
                       item.urgency === 'Critical' ? 'text-red-400' : 
                       item.urgency === 'High' ? 'text-orange-400' : 'text-cyan-400'
                     }`}>{item.urgency} Priority</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Risk by Region</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={REGION_STATS} margin={{ left: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={90} tick={{fontSize: 13, fill: '#cbd5e1'}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={24}>
                    {REGION_STATS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.riskScore > 90 ? '#ef4444' : entry.riskScore > 80 ? '#f97316' : '#eab308'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Urgent Alerts</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AlertItem 
                type="Critical" 
                msg="Sudan: Severe fuel shortages reported in El Fasher trauma centers." 
                time="10m ago" 
              />
              <AlertItem 
                type="High" 
                msg="Gaza: Communication blackout in Northern sector." 
                time="45m ago" 
              />
              <AlertItem 
                type="Medium" 
                msg="Ukraine: Winter storm warning affecting Odessa supply route." 
                time="2h ago" 
              />
              <div className="p-4 bg-cyan-900/20 border border-cyan-800/50 rounded-lg cursor-pointer hover:bg-cyan-900/30 transition-colors">
                <p className="text-sm text-cyan-300 flex gap-2 items-center font-medium">
                   <ArrowRight className="w-4 h-4" />
                   Review full Regional Briefing
                </p>
              </div>
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
    <div className="glass-panel p-6 rounded-xl hover:bg-slate-800/80 transition-colors border border-slate-700/50">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
          {icon}
        </div>
      </div>
      <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
      <div className={`text-sm font-medium ${getChangeColor()}`}>
        {change} <span className="text-slate-500 font-normal ml-1">vs last week</span>
      </div>
    </div>
  );
};

const AlertItem = ({ type, msg, time }: any) => {
  const color = type === 'Critical' ? 'bg-red-500' : type === 'High' ? 'bg-orange-500' : 'bg-yellow-500';
  return (
    <div className="flex gap-4 items-start p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
      <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${color} shadow-[0_0_10px] shadow-${color}/50`} />
      <div>
        <p className="text-sm text-slate-200 leading-snug font-medium">{msg}</p>
        <span className="text-xs text-slate-500 mt-2 block font-medium">{time}</span>
      </div>
    </div>
  );
};

export default Dashboard;
