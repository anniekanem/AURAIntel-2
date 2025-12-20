
import React, { useState, useEffect } from 'react';
import { SavedReport } from '../types';
// Added RefreshCcw to imports
import { 
  FileText, Trash2, Calendar, MapPin, AlertTriangle, Search, BookOpen, 
  ExternalLink, Download, Clock, X, FilterX, Users, Navigation, 
  ShieldAlert, Layers, Activity, Layout, Heart, Droplets, Utensils, 
  Shield, Book, Info, ArrowRight, Share2, Printer, Archive, Accessibility,
  Copy, Check, ChevronLeft, ChevronRight, Mail, Link as LinkIcon, Sparkles, Key,
  RefreshCcw
} from 'lucide-react';

const ReportsLibrary = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  const [modalPage, setModalPage] = useState(1);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

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

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleGenerateShareableLink = async () => {
    if (!selectedReport) return;
    setIsGeneratingLink(true);
    
    // Simulate generation of a secure, unique, temporary token
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const uniqueToken = btoa(`${selectedReport.reportId}-${Date.now()}`).substring(0, 16);
    const temporaryUrl = `${window.location.origin}/intel/reports/${selectedReport.reportId}?token=${uniqueToken}&expiry=${Date.now() + 86400000}`;
    
    copyToClipboard(temporaryUrl, 'shareLink');
    setIsGeneratingLink(false);
    setIsShareMenuOpen(false);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const reportDate = new Date(r.timestamp).getTime();
    const start = filterStartDate ? new Date(filterStartDate).setHours(0, 0, 0, 0) : null;
    const end = filterEndDate ? new Date(filterEndDate).setHours(23, 59, 59, 999) : null;
    return matchesSearch && (start ? reportDate >= start : true) && (end ? reportDate <= end : true);
  });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getSectorIcon = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes('health')) return <Heart className="w-4 h-4 text-rose-500" />;
    if (s.includes('wash')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (s.includes('food')) return <Utensils className="w-4 h-4 text-green-500" />;
    if (s.includes('protection')) return <Shield className="w-4 h-4 text-purple-500" />;
    return <Layout className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 print:p-0">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-cyan-400 w-7 h-7" /> Intelligence Library
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Strategic Repository • JIAF v2.8 Historical Data</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 md:w-64 min-w-[220px]">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reports..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-300 focus:border-cyan-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={clearAll} className="px-5 py-2.5 bg-slate-800 border border-rose-900/50 text-rose-400 hover:bg-rose-900/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all">
            <Trash2 className="w-4 h-4 inline mr-2" /> Reset Library
          </button>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report.reportId}
              onClick={() => { setSelectedReport(report); setModalPage(1); }}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group relative overflow-hidden h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-5 relative z-10">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm
                  ${report.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                    report.riskLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
                `}>
                  {report.riskLevel} ALERT
                </span>
                <button onClick={(e) => deleteReport(report.reportId, e)} className="p-1.5 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>
              <h3 className="font-black text-white text-xl mb-3 group-hover:text-cyan-400 transition-colors truncate">{report.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1 italic">"{report.summary}"</p>
              <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-auto">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {formatDate(report.timestamp)}</div>
                <div className="text-cyan-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">Open Record <ArrowRight className="w-3 h-3" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass-panel rounded-3xl border-2 border-dashed border-slate-800">
          <Archive className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h3 className="text-slate-400 font-black text-xl uppercase tracking-widest">Library Standby</h3>
          <p className="text-slate-600 mt-2 text-sm max-w-sm mx-auto">Generate SITREPs in the Intelligence Node to populate the Strategic Archive.</p>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-950/98 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white text-slate-900 w-full max-w-5xl h-full md:h-[95vh] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="bg-slate-50 border-b border-slate-200 px-10 py-6 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-5">
                   <div className="p-4 bg-slate-900 text-white rounded-3xl"><FileText className="w-7 h-7" /></div>
                   <div>
                     <h2 className="text-2xl font-black tracking-tighter uppercase mb-1 leading-none">STRATEGIC RECORD</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{formatDate(selectedReport.timestamp)}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="relative">
                      <button 
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl hover:bg-slate-50 shadow-sm transition-all ${isShareMenuOpen ? 'ring-2 ring-cyan-500/50' : ''}`}
                      >
                         <Share2 className="w-4 h-4" /> Share Access
                      </button>
                      {isShareMenuOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] z-50 overflow-hidden animate-in slide-in-from-top-2">
                           <button 
                             onClick={handleGenerateShareableLink}
                             disabled={isGeneratingLink}
                             className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-cyan-50 flex items-center justify-between transition-colors border-b border-slate-100 group"
                           >
                              <div className="flex items-center gap-3">
                                <Key className="w-4 h-4 text-cyan-600" /> 
                                <span>{isGeneratingLink ? 'Generating...' : (copiedSection === 'shareLink' ? 'Copied to Clipboard!' : 'Temporary Share Link')}</span>
                              </div>
                              {isGeneratingLink ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-125 transition-transform" />}
                           </button>
                           <button className="w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                              <Mail className="w-4 h-4" /> Forward via Secure Mail
                           </button>
                           <div className="bg-slate-50 p-3 text-[8px] font-bold text-slate-400 uppercase text-center border-t border-slate-100">
                             Links are encrypted and valid for 24h
                           </div>
                        </div>
                      )}
                   </div>
                   <button onClick={() => window.print()} className="p-3 bg-slate-900 text-white rounded-2xl hover:scale-110 transition-all"><Printer className="w-5 h-5" /></button>
                   <button onClick={() => setSelectedReport(null)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-200 p-12 custom-scrollbar-light">
                 <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-[1.5cm] min-h-[29.7cm] border-t-[20px] border-slate-900 relative">
                    <div className="border-b-4 border-slate-900 pb-12 mb-12">
                       <h1 className="text-5xl font-black uppercase text-slate-900 tracking-tighter leading-tight mb-4">{selectedReport.title}</h1>
                       <div className="flex items-center gap-4">
                          <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-xs">Priority Protection Record</span>
                          <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">JIAF v2.8 Standard</span>
                       </div>
                    </div>
                    <div className="space-y-12">
                       <section>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">1.0 PROTECTION LENS AUDIT</h3>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm">
                                <h4 className="text-[10px] font-black text-rose-600 uppercase mb-3 flex items-center gap-2"><Users className="w-3 h-3" /> Women & Children</h4>
                                <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{selectedReport.population.womenAndChildren}"</p>
                                <p className="text-[9px] font-black text-rose-400 mt-4 uppercase">Demographic Pool: {selectedReport.population.disaggregationData.womenPercentage + selectedReport.population.disaggregationData.childrenPercentage}%</p>
                             </div>
                             <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                                <h4 className="text-[10px] font-black text-amber-600 uppercase mb-3 flex items-center gap-2"><Accessibility className="w-3 h-3" /> PWD Accessibility</h4>
                                <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{selectedReport.population.elderlyAndPWD}"</p>
                                <p className="text-[9px] font-black text-amber-400 mt-4 uppercase">Demographic Pool: {selectedReport.population.disaggregationData.pwdPercentage}%</p>
                             </div>
                          </div>
                       </section>
                       <section>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">2.0 SECTORAL DIRECTIVES</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedReport.sectors.map((s, i) => (
                              <div key={i} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">{getSectorIcon(s.sector)}</div>
                                <div className="flex-1">
                                  <h4 className="text-[10px] font-black uppercase text-slate-900 mb-1">{s.sector}</h4>
                                  <p className="text-[10px] text-slate-600 font-bold leading-relaxed mb-2 line-clamp-2">"{s.findings}"</p>
                                  <p className="text-[8px] font-black text-cyan-600 uppercase">Action: {s.intervention}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                       </section>
                    </div>
                    <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Aura Strategic Archive Record ID: {selectedReport.reportId}</p>
                       <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.3em]">Confidential • Field Consumption Only</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsLibrary;
