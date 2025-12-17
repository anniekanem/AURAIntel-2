
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar, Legend, BarChart, Bar, Cell } from 'recharts';
import { KPI_RESPONSE_DATA, KPI_COVERAGE_DATA, MOCK_CHART_DATA, TURNAROUND_DATA } from '../constants';
import { TrendingDown, Users, PackageCheck, HeartPulse, RotateCcw } from 'lucide-react';

const PerformanceDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Performance KPIs</h2>
        <p className="text-slate-400 text-sm">Monitoring aid efficiency, coverage, and security metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-4 md:p-6 rounded-xl border-l-4 border-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Response Velocity</p>
              <h3 className="text-3xl font-bold text-white mt-1">6.1h</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingDown className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 font-medium">↓ 2.3h <span className="text-slate-500">vs last month</span></p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-3/4"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Target: 8h maximum response time</p>
        </div>

        <div className="glass-panel p-4 md:p-6 rounded-xl border-l-4 border-cyan-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pop. Reached</p>
              <h3 className="text-3xl font-bold text-white mt-1">84%</h3>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Users className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
          <p className="text-xs text-cyan-400 font-medium">↑ 12% <span className="text-slate-500">vs last campaign</span></p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-[84%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Based on estimated needs assessment</p>
        </div>

        <div className="glass-panel p-4 md:p-6 rounded-xl border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Supply Chain</p>
              <h3 className="text-3xl font-bold text-white mt-1">98.2%</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <PackageCheck className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-purple-400 font-medium">↑ 0.5% <span className="text-slate-500">successful deliveries</span></p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[98%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Zero loss tolerance policy active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Velocity Trend */}
        <div className="glass-panel p-4 md:p-6 rounded-xl">
           <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
             <HeartPulse className="text-emerald-500 w-5 h-5" /> Response Velocity Trend (Hours)
           </h3>
           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={KPI_RESPONSE_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                 <YAxis stroke="#94a3b8" fontSize={12} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                   itemStyle={{ color: '#e2e8f0' }}
                 />
                 <Line type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                 <Line type="monotone" dataKey="target" stroke="#64748b" strokeDasharray="5 5" strokeWidth={2} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Coverage Radial */}
        <div className="glass-panel p-4 md:p-6 rounded-xl">
           <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
             <PackageCheck className="text-cyan-500 w-5 h-5" /> Resource Coverage by Sector
           </h3>
           <div className="h-72 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart innerRadius="20%" outerRadius="100%" data={KPI_COVERAGE_DATA} startAngle={180} endAngle={0}>
                 <RadialBar
                   label={{ position: 'insideStart', fill: '#fff' }}
                   background
                   dataKey="value"
                   cornerRadius={10}
                 />
                 <Legend 
                   iconSize={10} 
                   layout="vertical" 
                   verticalAlign="middle" 
                   wrapperStyle={{ right: 0 }} 
                   formatter={(value, entry: any) => <span className="text-slate-300 text-sm ml-2">{value}</span>}
                 />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} 
                 />
               </RadialBarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnaround Time Breakdown */}
        <div className="glass-panel p-4 md:p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <RotateCcw className="text-purple-400 w-5 h-5" /> Response Turnaround Cycle (Hours)
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={TURNAROUND_DATA} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                 <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                 <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                   cursor={{fill: '#1e293b', opacity: 0.4}}
                 />
                 <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={20}>
                    {TURNAROUND_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Index Visual */}
        <div className="glass-panel p-4 md:p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Safety Incident Index</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_CHART_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                 <YAxis stroke="#94a3b8" fontSize={12} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                   cursor={{fill: '#1e293b', opacity: 0.4}}
                 />
                 <Bar dataKey="severity" name="Severity Index" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    {MOCK_CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.severity > 3 ? '#ef4444' : '#eab308'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
