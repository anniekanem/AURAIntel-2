
import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { ShieldAlert, Info, MapPin, Navigation } from 'lucide-react';

const AbstractMap = () => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Simplified relative coordinates for an abstract "Risk Map"
  // This visualizes the connections and relative severity rather than strict geography
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
    { from: {x: 60, y: 45}, to: {x: 55, y: 38}, status: 'Blocked' }, // Sudan -> Gaza (Abstract)
    { from: {x: 60, y: 45}, to: {x: 60, y: 65}, status: 'High Risk' }, // Sudan -> DRC
    { from: {x: 55, y: 38}, to: {x: 62, y: 35}, status: 'Caution' }, // Gaza -> Syria
    { from: {x: 58, y: 28}, to: {x: 62, y: 35}, status: 'Safe' }, // Ukraine -> Syria (Abstract supply line)
    { from: {x: 45, y: 50}, to: {x: 60, y: 45}, status: 'High Risk' }, // Nigeria -> Sudan
  ];

  const getColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return '#ef4444'; // Red-500
      case 'High': return '#f97316'; // Orange-500
      case 'Medium': return '#eab308'; // Yellow-500
      default: return '#3b82f6'; // Blue-500
    }
  };

  const getRouteColor = (status: string) => {
    switch (status) {
      case 'Safe': return '#10b981'; // Green (Safe)
      case 'Caution': return '#eab308'; // Yellow (Caution)
      case 'High Risk': return '#f97316'; // Orange (Risk)
      case 'Blocked': return '#ef4444'; // Red (Blocked)
      default: return '#334155';
    }
  };

  const getRouteDash = (status: string) => {
    if (status === 'Safe') return 'none'; // Solid line for safe
    if (status === 'Blocked') return '2 2'; // Dotted for blocked
    return '5 5'; // Dashed for others
  };

  return (
    <div className="relative w-full h-[350px] md:h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 glass-panel p-3 md:p-4 rounded-lg max-w-[200px] md:max-w-xs">
        <h3 className="text-cyan-400 font-bold text-sm md:text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Global Threat Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-snug">
          Live visualization of active high-priority zones and supply corridors.
        </p>
      </div>

      {/* Legend for Mobility */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 rounded-lg flex flex-col gap-2 md:flex-row md:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-emerald-500"></div>
          <span className="text-xs font-medium text-slate-300">Safe Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500 border-t border-b border-transparent border-dashed"></div>
          <span className="text-xs font-medium text-slate-300">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-orange-500 border-t border-b border-transparent border-dotted"></div>
          <span className="text-xs font-medium text-slate-300">High Risk</span>
        </div>
      </div>

      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Connecting Lines (Mobility Routes) */}
        {routes.map((route, i) => (
          <g key={i}>
            <path 
              d={`M ${route.from.x} ${route.from.y} L ${route.to.x} ${route.to.y}`} 
              stroke={getRouteColor(route.status)} 
              strokeWidth="0.8" 
              strokeDasharray={getRouteDash(route.status)}
              opacity="0.6"
            />
            {/* Direction Arrows */}
            {route.status === 'Safe' && (
               <circle cx={(route.from.x + route.to.x)/2} cy={(route.from.y + route.to.y)/2} r="0.8" fill="#10b981">
                 <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
               </circle>
            )}
          </g>
        ))}

        {/* Locations */}
        {locations.map((loc) => (
          <g 
            key={loc.id} 
            onMouseEnter={() => setHoveredRegion(loc.id)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => setHoveredRegion(hoveredRegion === loc.id ? null : loc.id)} // Tap for mobile
            className="cursor-pointer transition-all duration-300"
            style={{ opacity: hoveredRegion && hoveredRegion !== loc.id ? 0.3 : 1 }}
          >
            {/* Pulse Effect for Critical */}
            {loc.risk === 'Critical' && (
              <circle cx={loc.x} cy={loc.y} r={loc.r + 5} fill={getColor(loc.risk)} opacity="0.2">
                <animate attributeName="r" from={loc.r} to={loc.r + 8} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            
            <circle cx={loc.x} cy={loc.y} r={loc.r / 2} fill={getColor(loc.risk)} className="drop-shadow-lg" />
            <circle cx={loc.x} cy={loc.y} r={1.5} fill="#fff" />
            
            <text x={loc.x} y={loc.y + loc.r/2 + 5} fontSize="4.5" textAnchor="middle" fill="#f1f5f9" fontWeight="700" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}>
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
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              locations.find(l => l.id === hoveredRegion)?.risk === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
            }`}>
              {locations.find(l => l.id === hoveredRegion)?.risk} Risk
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_INCIDENTS.filter(i => i.region.includes(hoveredRegion)).slice(0, 2).map(incident => (
              <div key={incident.id} className="text-sm text-slate-200 border-l-4 border-slate-600 pl-3 py-1 leading-snug bg-slate-800/30 rounded-r">
                {incident.description}
              </div>
            ))}
            {MOCK_INCIDENTS.filter(i => i.region.includes(hoveredRegion)).length === 0 && (
              <p className="text-sm text-slate-500 italic">No active incidents reported in last 24h.</p>
            )}
            <div className="mt-2 pt-3 border-t border-slate-700/50 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400 font-medium">Mobility data updated 10m ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbstractMap;
