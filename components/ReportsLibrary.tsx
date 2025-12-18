
import React, { useState, useEffect } from 'react';
import { SavedReport } from '../types';
// Added X to the import list
import { FileText, Trash2, Calendar, MapPin, AlertTriangle, Search, BookOpen, ExternalLink, Download, Clock, X } from 'lucide-react';

const ReportsLibrary = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const history = JSON.parse(localStorage.getItem('aura_reports_history') || '[]');
    setReports(history);
  };

  const deleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reports.filter(r => r.reportId !== id);
    localStorage.setItem('aura_reports_history', JSON.stringify(updated));
    setReports(updated);
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear your entire report history?")) {
      localStorage.removeItem('aura_reports_history');
      setReports([]);
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-cyan-400 w-7 h-7" /> Intelligence Library
          </h2>
          <p className="text-slate-400 text-sm mt-1">Access and manage your historical Situation Reports.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reports..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:border-cyan-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={clearAll}
            className="px-4 py-2 border border-rose-900/50 text-rose-400 hover:bg-rose-900/20 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report.reportId}
              onClick={() => setSelectedReport(report)}
              className="glass-panel p-6 rounded-xl border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-700/20 to-transparent pointer-events-none`} />
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border
                  ${report.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                    report.riskLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
                `}>
                  {report.riskLevel}
                </span>
                <button 
                  onClick={(e) => deleteReport(report.reportId, e)}
                  className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{report.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{report.summary}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {formatDate(report.timestamp)}
                </div>
                <div className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-xs font-bold">
                  View <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-20 rounded-xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800">
          <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
          <h3 className="text-slate-400 font-medium text-xl">Your Library is Empty</h3>
          <p className="text-slate-600 mt-2 max-w-sm">Reports generated in the analysis tool will automatically appear here for your records.</p>
        </div>
      )}

      {/* Detail Modal Re-use logic or simpler display */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg"><FileText className="w-5 h-5" /></div>
                   <div>
                     <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                     <p className="text-xs text-slate-500">{formatDate(selectedReport.timestamp)} • ID: {selectedReport.reportId}</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                 <div className={`p-4 rounded-xl border-l-4 ${selectedReport.riskLevel === 'Critical' ? 'bg-red-500/5 border-red-500' : 'bg-cyan-500/5 border-cyan-500'}`}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Summary</h4>
                    <p className="text-slate-200 leading-relaxed text-lg">{selectedReport.summary}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quantified Logistics</h4>
                       <div className="space-y-3">
                          {selectedReport.logistics.map((log, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                               <span className="text-sm font-medium text-slate-200">{log.item}</span>
                               <span className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">{log.quantity}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Priority Interventions</h4>
                       <div className="space-y-3">
                          {selectedReport.sectoralAnalysis.map((sec, i) => (
                            <div key={i} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                               <span className="text-xs font-bold text-slate-400 block mb-1">{sec.sector}</span>
                               <span className="text-sm text-slate-200">{sec.recommendedIntervention}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                 <button onClick={() => setSelectedReport(null)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsLibrary;
