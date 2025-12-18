
import React, { useState, useEffect } from 'react';
import { SavedReport } from '../types';
import { 
  FileText, Trash2, Calendar, MapPin, AlertTriangle, Search, BookOpen, 
  ExternalLink, Download, Clock, X, FilterX, Users, Navigation, 
  ShieldAlert, Layers, Activity, Layout, Heart, Droplets, Utensils, 
  Shield, Book, Info, ArrowRight, Share2, Printer, Archive, Accessibility,
  Copy, Check, ChevronLeft, ChevronRight, Mail, Link as LinkIcon
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

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const reportDate = new Date(r.timestamp).getTime();
    const start = filterStartDate ? new Date(filterStartDate).setHours(0, 0, 0, 0) : null;
    const end = filterEndDate ? new Date(filterEndDate).setHours(23, 59, 59, 999) : null;
    
    const matchesStart = start ? reportDate >= start : true;
    const matchesEnd = end ? reportDate <= end : true;

    return matchesSearch && matchesStart && matchesEnd;
  });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleOpenReport = (report: SavedReport) => {
    setSelectedReport(report);
    setModalPage(1);
    setIsShareMenuOpen(false);
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const shareViaEmail = () => {
    if (!selectedReport) return;
    const subject = encodeURIComponent(`Aura Intel: SITREP ${selectedReport.title}`);
    const body = encodeURIComponent(`HUMANITARIAN SITREP PREVIEW\n\nTitle: ${selectedReport.title}\nRisk Level: ${selectedReport.riskLevel}\nSummary: ${selectedReport.summary}\n\nView full intelligence report in Aura Platform.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsShareMenuOpen(false);
  };

  const copyShareLink = () => {
    if (!selectedReport) return;
    const dummyLink = `${window.location.origin}/intel/reports/${selectedReport.reportId}`;
    copyToClipboard(dummyLink, 'shareLink');
    setIsShareMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalPages = 3;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 print:p-0">
      {/* Search & Filter Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-cyan-400 w-7 h-7" /> Intelligence Library
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Strategic Repository • JIAF v2.8 Historical Data</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/50 shadow-xl">
            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="date" 
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="bg-transparent text-xs text-slate-300 outline-none focus:text-white"
              />
            </div>
            <span className="text-slate-600 text-xs font-black">—</span>
            <div className="flex items-center gap-2 px-2">
              <input 
                type="date" 
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="bg-transparent text-xs text-slate-300 outline-none focus:text-white"
              />
            </div>
            {(filterStartDate || filterEndDate || searchTerm) && (
              <button 
                onClick={resetFilters}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Clear Filters"
              >
                <FilterX className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative flex-1 md:w-64 min-w-[220px]">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by title or region..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-300 focus:border-cyan-500 outline-none shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={clearAll}
            className="px-5 py-2.5 bg-slate-800/50 border border-rose-900/50 text-rose-400 hover:bg-rose-900/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Reset Library
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          {filteredReports.map((report) => (
            <div 
              key={report.reportId}
              onClick={() => handleOpenReport(report)}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group relative overflow-hidden shadow-xl hover:shadow-cyan-950/20 flex flex-col h-full"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-700/10 to-transparent pointer-events-none group-hover:from-cyan-500/10 transition-colors`} />
              
              <div className="flex justify-between items-start mb-5 relative z-10">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm
                  ${report.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                    report.riskLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}
                `}>
                  {report.riskLevel} MISSION
                </span>
                <button 
                  onClick={(e) => deleteReport(report.reportId, e)}
                  className="p-1.5 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              <h3 className="font-black text-white text-xl mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors tracking-tight leading-none uppercase">{report.title}</h3>
              <p className="text-slate-400 text-sm mb-8 line-clamp-3 leading-relaxed font-medium flex-1">{report.summary}</p>

              <div className="flex items-center justify-between pt-5 border-t border-slate-800 mt-auto relative z-10">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(report.timestamp)}
                </div>
                <div className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                  ACCESS INTEL <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-24 rounded-3xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 bg-slate-900/10 print:hidden">
          <div className="p-6 bg-slate-900 rounded-3xl mb-8 shadow-2xl border border-slate-800">
            <Archive className="w-16 h-16 text-slate-700" />
          </div>
          <h3 className="text-slate-400 font-black text-2xl uppercase tracking-tighter">No Intelligence Found</h3>
          <p className="text-slate-600 mt-3 max-w-sm text-sm font-medium leading-relaxed">Adjust your temporal filters or search criteria. Generated Situational Reports are automatically archived here.</p>
          {(filterStartDate || filterEndDate || searchTerm) && (
            <button 
              onClick={resetFilters}
              className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all border border-slate-700"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* FULL STRATEGIC SITREP PREVIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-950/98 backdrop-blur-xl animate-in fade-in duration-300 print:relative print:inset-0 print:p-0 print:bg-white">
           <div className="bg-white text-slate-900 w-full max-w-6xl h-full md:h-[95vh] md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10 print:h-auto print:rounded-none print:shadow-none">
              
              {/* MODAL HEADER */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 md:px-10 flex justify-between items-center shrink-0 print:hidden">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl"><FileText className="w-7 h-7" /></div>
                   <div>
                     <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1 uppercase">SITREP PREVIEW</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{formatDate(selectedReport.timestamp)} • PAGE {modalPage} OF {totalPages}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="relative">
                      <button 
                        onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl hover:bg-slate-50 transition-colors ${isShareMenuOpen ? 'ring-2 ring-cyan-500/50 shadow-lg' : ''}`}
                      >
                         <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                      
                      {isShareMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                           <button 
                             onClick={copyShareLink}
                             className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-100"
                           >
                              <LinkIcon className="w-4 h-4 text-cyan-600" /> 
                              {copiedSection === 'shareLink' ? 'Link Copied!' : 'Copy Direct Link'}
                           </button>
                           <button 
                             onClick={shareViaEmail}
                             className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                           >
                              <Mail className="w-4 h-4 text-blue-600" /> Email SITREP
                           </button>
                        </div>
                      )}
                   </div>
                   
                   <button 
                    onClick={handlePrint}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                   >
                      <Printer className="w-3.5 h-3.5" /> Print
                   </button>
                   <button onClick={() => setSelectedReport(null)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                 </div>
              </div>

              {/* MODAL CONTENT */}
              <div className="flex-1 overflow-y-auto bg-slate-200 p-4 md:p-12 custom-scrollbar-light print:p-0 print:bg-white print:overflow-visible">
                 <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-8 md:p-[1.5cm] min-h-[20cm] text-slate-800 font-sans border-t-[16px] border-slate-900 relative overflow-hidden flex flex-col print:shadow-none print:border-none print:min-h-0 print:p-0">
                    
                    {/* CONFIDENTIAL WATERMARK */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] opacity-[0.03] pointer-events-none select-none print:hidden">
                       <h1 className="text-[100px] font-black whitespace-nowrap uppercase">RESTRICTED INTEL</h1>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-slate-900 pb-8 mb-8 relative z-10">
                       <div className="flex-1">
                         <h1 className="text-3xl md:text-5xl font-black leading-[1.0] uppercase mb-2 tracking-tighter text-slate-900">{selectedReport.title}</h1>
                         <p className="text-blue-700 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Humanitarian Needs Overview & Forecast • {modalPage === 1 ? 'Phase I' : modalPage === 2 ? 'Phase II' : 'Phase III'}</p>
                       </div>
                       <div className="text-left md:text-right">
                         <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Temporal scope</p>
                         <p className="font-black text-slate-900 text-sm whitespace-nowrap">{selectedReport.dateRange?.start || 'N/A'} — {selectedReport.dateRange?.end || 'N/A'}</p>
                         <div className={`inline-block px-3 py-1 rounded-lg mt-3 text-[9px] font-black uppercase tracking-widest border ${
                            selectedReport.riskLevel === 'Critical' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-200 text-orange-600'
                         }`}>
                            {selectedReport.riskLevel} PRIORITY
                         </div>
                       </div>
                    </div>

                    <div className="space-y-10 relative z-10 flex-1">
                      
                      {/* PAGE 1: OVERVIEW & CONTEXT */}
                      {(modalPage === 1 || true) && (
                        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 ${modalPage !== 1 ? 'hidden print:block' : ''}`}>
                          <section>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">1.0 EXECUTIVE SUMMARY</h3>
                              <button 
                                onClick={() => copyToClipboard(selectedReport.summary, 'summary')}
                                className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-2 group print:hidden"
                              >
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Copy Summary</span>
                                {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <p className="text-base md:text-lg leading-relaxed font-bold tracking-tight text-slate-800 italic">
                               "{selectedReport.summary}"
                            </p>
                          </section>

                          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-100 pb-2 mb-4">2.0 MISSION CONTEXT</h3>
                               <p className="text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{selectedReport.context}</p>
                            </div>
                            <div>
                               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-100 pb-2 mb-4">2.1 ANALYTICAL METHODOLOGY</h3>
                               <p className="text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{selectedReport.methodology}</p>
                            </div>
                          </section>
                        </div>
                      )}

                      {/* PAGE 2: IMPACT ASSESSMENT */}
                      {(modalPage === 2 || true) && (
                        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 ${modalPage !== 2 ? 'hidden print:block' : ''}`}>
                          <section>
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-100 pb-2 mb-6">3.0 AFFECTED POPULATION IMPACT</h3>
                             <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-slate-200 pb-8">
                                   <div className="text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Total Verified PiN</p>
                                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedReport.population.totalPiN}</p>
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Protection Lens (W+C)</p>
                                      <p className="text-4xl font-black text-rose-600 tracking-tighter">
                                         {((selectedReport.population.disaggregationData.womenPercentage || 0) + (selectedReport.population.disaggregationData.childrenPercentage || 0)).toFixed(0)}%
                                      </p>
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Vulnerability/PWD</p>
                                      <p className="text-4xl font-black text-blue-600 tracking-tighter">
                                         {(selectedReport.population.disaggregationData.pwdPercentage || 0).toFixed(0)}%
                                      </p>
                                   </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="font-black uppercase text-[9px] mb-2 text-slate-900 tracking-widest flex items-center gap-2">
                                         <Users className="w-3 h-3 text-blue-500" /> A. GENDER & AGE ANALYSIS
                                      </p>
                                      <p className="text-slate-600 font-medium italic text-xs leading-relaxed">{selectedReport.population.womenAndChildren}</p>
                                   </div>
                                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="font-black uppercase text-[9px] mb-2 text-slate-900 tracking-widest flex items-center gap-2">
                                         <Accessibility className="w-3 h-3 text-rose-500" /> B. DISABILITY & ELDERLY
                                      </p>
                                      <p className="text-slate-600 font-medium text-xs leading-relaxed">{selectedReport.population.elderlyAndPWD}</p>
                                   </div>
                                </div>
                             </div>
                          </section>
                        </div>
                      )}

                      {/* PAGE 3: OPERATIONAL STRATEGY */}
                      {(modalPage === 3 || true) && (
                        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 ${modalPage !== 3 ? 'hidden print:block' : ''}`}>
                          <section>
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-100 pb-2 mb-6">4.0 HUMANITARIAN ACCESS & MOBILITY</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                                   <div className="flex items-center gap-2 mb-4">
                                      <ShieldAlert className="w-4 h-4 text-red-600" />
                                      <h4 className="text-[10px] font-black text-red-900 uppercase tracking-widest">AI THREAT ASSESSMENT</h4>
                                   </div>
                                   <p className="text-xs text-red-800 font-black leading-relaxed">{selectedReport.safetySecurity}</p>
                                </div>
                                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                   <div className="flex items-center gap-2 mb-4">
                                      <Navigation className="w-4 h-4 text-emerald-600" />
                                      <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">STRATEGIC CORRIDORS</h4>
                                   </div>
                                   <div className="space-y-3">
                                      {selectedReport.mobility.slice(0, 4).map((m, i) => (
                                         <div key={i} className="flex justify-between items-center text-emerald-950 font-black border-b border-emerald-100 pb-2 last:border-0">
                                            <div className="flex flex-col">
                                              <span className="uppercase text-[9px] tracking-tight">{m.route}</span>
                                              <span className="text-[7px] text-emerald-600 font-medium leading-none mt-0.5">{m.details}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-lg text-[8px] uppercase shadow-sm ${
                                              m.status === 'Safe' ? 'bg-emerald-200 text-emerald-800' : 
                                              m.status === 'Caution' ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'
                                            }`}>{m.status}</span>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </section>

                          <section>
                             <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">5.0 QUANTIFIED SECTORAL NEEDS</h3>
                                <button 
                                  onClick={() => copyToClipboard(selectedReport.sectors.map(s => `${s.sector}: ${s.findings}`).join('\n'), 'findings')}
                                  className="p-1.5 text-slate-400 hover:text-cyan-600 transition-colors flex items-center gap-2 group print:hidden"
                                >
                                  <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Copy Findings</span>
                                  {copiedSection === 'findings' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {selectedReport.sectors.map((s, i) => (
                                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-all group/sector">
                                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm group-hover/sector:border-cyan-200">
                                     {getSectorIcon(s.sector)}
                                   </div>
                                   <div className="flex-1">
                                     <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-tight">{s.sector}</h4>
                                        <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border ${
                                          s.severity.includes('Critical') ? 'bg-red-50 text-red-600 border-red-100' : 
                                          s.severity.includes('High') ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>{s.severity}</span>
                                     </div>
                                     <p className="text-[10px] text-slate-600 font-medium leading-relaxed line-clamp-3 mb-2">{s.findings}</p>
                                     <div className="flex items-center gap-2 text-[8px] font-black text-cyan-600 uppercase border-t border-slate-100 pt-2">
                                        <Activity className="w-2.5 h-2.5" /> Recommended: {s.intervention}
                                     </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                          </section>
                        </div>
                      )}

                    </div>

                    {/* PAGINATION CONTROLS */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center relative z-20 print:hidden">
                       <button 
                         disabled={modalPage === 1}
                         onClick={() => setModalPage(p => p - 1)}
                         className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            modalPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95'
                         }`}
                       >
                          <ChevronLeft className="w-4 h-4" /> Previous
                       </button>

                       <div className="flex items-center gap-3">
                          {[1, 2, 3].map(p => (
                            <button 
                              key={p} 
                              onClick={() => setModalPage(p)}
                              className={`w-2.5 h-2.5 rounded-full transition-all ${modalPage === p ? 'bg-slate-900 scale-125' : 'bg-slate-200 hover:bg-slate-300'}`} 
                            />
                          ))}
                       </div>

                       <button 
                         disabled={modalPage === totalPages}
                         onClick={() => setModalPage(p => p + 1)}
                         className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            modalPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95'
                         }`}
                       >
                          Next <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-end print:mt-4">
                       <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.2em]">Aura Intel Intelligence Record • Record ID: {selectedReport.reportId}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">RESTRICTED CIRCULATION • VALIDATED</p>
                    </div>
                 </div>
              </div>

              {/* MODAL FOOTER ACTION */}
              <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-4 shrink-0 print:hidden">
                 <button onClick={() => setSelectedReport(null)} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl transition-all uppercase tracking-widest text-xs">Close Records</button>
                 <button 
                  onClick={handlePrint}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-cyan-900/20"
                 >
                    Full Intelligence Export
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Styles for print mode */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block { display: block !important; }
          .print\\:hidden { display: none !important; }
          .fixed.inset-0.z-50 { 
            position: absolute !important;
            visibility: visible !important;
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
          }
          .fixed.inset-0.z-50 * { visibility: visible !important; }
        }
      `}</style>
    </div>
  );
};

export default ReportsLibrary;
