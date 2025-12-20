
import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { ShieldAlert, Info, MapPin, Navigation, Satellite, Globe } from 'lucide-react';

const AbstractMap = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [satelliteMode, setSatelliteMode] = useState(false);

  // Simplified relative coordinates for an abstract "Risk Map"
  const locations = [
    { id: 'Sudan', x: 60, y: 45, r: 15, risk: 'Critical' },
    { id: 'Gaza', x: 55, y: 38, r: 12, risk: 'Critical' },
    { id: 'DRC', x: 60, y: 65, r: 14, risk: 'High' },
    { id: 'Nigeria', x: 45, y: 50, r: 14, risk: 'Medium' },
    { id: 'Ukraine', x: 58, y: 28, r: 12, risk: 'High' },
    { id: 'Afghanistan', x: 75, y: 38, r: 12, risk: 'Medium' },
    { id: 'Syria', x: 62, y: 35, r: 10, risk: 'High' },
  ];

  // Supply Routes with Status for Mobility Intelligence
  const routes = [
    { from: {x: 60, y: 45}, to: {x: 55, y: 38}, status: 'Blocked' },
    { from: {x: 60, y: 45}, to: {x: 60, y: 65}, status: 'High Risk' },
    { from: {x: 55, y: 38}, to: {x: 62, y: 35}, status: 'Caution' },
    { from: {x: 58, y: 28}, to: {x: 62, y: 35}, status: 'Safe' },
    { from: {x: 45, y: 50}, to: {x: 60, y: 45}, status: 'High Risk' },
  ];

  const getColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      default: return '#3b82f6';
    }
  };

  const getRouteColor = (status: string) => {
    switch (status) {
      case 'Safe': return '#10b981';
      case 'Caution': return '#eab308';
      case 'High Risk': return '#f97316';
      case 'Blocked': return '#ef4444';
      default: return '#334155';
    }
  };

  const getRouteDash = (status: string) => {
    if (status === 'Safe') return 'none';
    if (status === 'Blocked') return '2 2';
    return '5 5';
  };

  return (
    <div className={`relative w-full h-[350px] md:h-[500px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl transition-all duration-700 ${satelliteMode ? 'bg-[#000510]' : 'bg-slate-900'}`}>
      <div className="absolute top-4 left-4 z-10 glass-panel p-3 md:p-4 rounded-lg max-w-[200px] md:max-w-xs">
        <h3 className="text-cyan-400 font-bold text-sm md:text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Threat Matrix v3.1
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-snug">
          {satelliteMode ? 'Active Satellite Telemetry Layer' : 'Geospatial Intelligence Matrix'}
        </p>
      </div>

      {/* Layer Toggles */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={() => setSatelliteMode(!satelliteMode)}
          className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
            satelliteMode ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span className="hidden md:inline">Satellite Telemetry</span>
        </button>
        <button className="p-2.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
           <Globe className="w-4 h-4" />
           <span className="hidden md:inline">Social Sentiment</span>
        </button>
      </div>

      {/* Legend for Mobility */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 rounded-lg flex flex-col gap-2 md:flex-row md:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-emerald-500"></div>
          <span className="text-xs font-medium text-slate-300">Safe Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500 border-t border-b border-transparent border-dashed"></div>
          <span className="text-xs font-medium text-slate-300">Blocked Route</span>
        </div>
      </div>

      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={satelliteMode ? "#061025" : "#1e293b"} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="satelliteGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Telemetry Dots for Satellite Mode */}
        {satelliteMode && Array.from({length: 40}).map((_, i) => (
          <circle 
            key={i} 
            cx={Math.random() * 100} 
            cy={Math.random() * 100} 
            r="0.15" 
            fill="#00d4ff" 
            opacity={Math.random()} 
          >
            <animate attributeName="opacity" values="0;0.8;0" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Mobility Routes */}
        {routes.map((route, i) => (
          <g key={i}>
            <path 
              d={`M ${route.from.x} ${route.from.y} L ${route.to.x} ${route.to.y}`} 
              stroke={getRouteColor(route.status)} 
              strokeWidth={satelliteMode ? "0.4" : "0.8"} 
              strokeDasharray={getRouteDash(route.status)}
              opacity={satelliteMode ? "0.4" : "0.6"}
            />
            {route.status === 'Safe' && (
               <circle cx={(route.from.x + route.to.x)/2} cy={(route.from.y + route.to.y)/2} r="0.8" fill="#10b981">
                 <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
               </circle>
            )}
          </g>
        ))}

        {/* Strategic Nodes */}
        {locations.map((loc) => (
          <g 
            key={loc.id} 
            onMouseEnter={() => setHoveredRegion(loc.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-300"
            style={{ opacity: hoveredRegion && hoveredRegion !== loc.id ? 0.3 : 1 }}
          >
            {satelliteMode && (
              <circle cx={loc.x} cy={loc.y} r={loc.r} fill="url(#satelliteGlow)" />
            )}
            
            {loc.risk === 'Critical' && (
              <circle cx={loc.x} cy={loc.y} r={loc.r / 2 + 2} fill={getColor(loc.risk)} opacity="0.2">
                <animate attributeName="r" from={loc.r / 2} to={loc.r / 2 + 4} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            
            <circle cx={loc.x} cy={loc.y} r={loc.r / 2.5} fill={getColor(loc.risk)} className="drop-shadow-lg" />
            <circle cx={loc.x} cy={loc.y} r={1} fill="#fff" />
            
            <text x={loc.x} y={loc.y + loc.r/2 + 5} fontSize="4" textAnchor="middle" fill={satelliteMode ? "#00d4ff" : "#f1f5f9"} fontWeight="900" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {loc.id}
            </text>
          </g>
        ))}
      </svg>

      {/* Interactive Tooltip Overlay */}
      {hoveredRegion && (
        <div className="absolute bottom-4 right-4 left-4 md:left-auto glass-panel p-5 rounded-lg md:w-72 animate-in slide-in-from-bottom-5 fade-in duration-200 z-20 shadow-2xl border-t border-slate-600">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-white text-lg">{hoveredRegion}</h4>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
              locations.find(l => l.id === hoveredRegion)?.risk === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
            }`}>
              {locations.find(l => l.id === hoveredRegion)?.risk} Alert
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_INCIDENTS.filter(i => i.region.includes(hoveredRegion)).slice(0, 2).map(incident => (
              <div key={incident.id} className="text-[11px] text-slate-200 border-l-2 border-slate-600 pl-3 py-1 leading-snug bg-slate-800/30 rounded-r">
                {incident.description}
              </div>
            ))}
            <div className="mt-2 pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Telemetry Node {Math.floor(Math.random() * 999)}</span>
              <Navigation className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbstractMap;
