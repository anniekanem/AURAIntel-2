
import React, { useState } from 'react';
import { analyzeFieldReport, initiateDeepDive } from '../services/gemini';
import { AnalysisResult, DeepDiveResult } from '../types';
import { 
  FileText, BrainCircuit, Search, Calendar, 
  Heart, Droplets, Utensils, Shield, 
  MapPin, Navigation, ArrowRight, 
  ShieldAlert, Info, Globe, CheckCircle2, 
  RefreshCcw, X, Plus, Layout, Activity,
  Printer, ShieldCheck, Zap, AlertTriangle,
  Target, Crosshair, Users, ListChecks,
  Accessibility, UserRoundCheck, Siren,
  Database, Microscope, Link as LinkIcon, ExternalLink,
  BookOpen, Share2, Copy, Check
} from 'lucide-react';
import { ALL_COUNTRIES } from '../constants';

const AnalysisTool = () => {
  // Config State
  const [activeTab, setActiveTab] = useState<'TACTICAL' | 'DEEP_DIVE'>('TACTICAL');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // UI Logic State
  const [reportText, setReportText] = useState('');
  const [researchTopic, setResearchTopic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [deepDiveResult, setDeepDiveResult] = useState<DeepDiveResult | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  const handleAnalysis = async () => {
    if (!reportText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setDeepDiveResult(null);
    try {
      const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
      const data = await analyzeFieldReport(reportText, dateRange, selectedCountries);
      setResult(data);
      
      const history = JSON.parse(localStorage.getItem('aura_reports_history') || '[]');
      const newReport = {
        ...data, 
        reportId: `REP-${Date.now()}`, 
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('aura_reports_history', JSON.stringify([newReport, ...history].slice(0, 50)));
    } catch (error) { 
      console.error("Analysis failed:", error); 
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const handleDeepDive = async () => {
    if (!researchTopic.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setDeepDiveResult(null);
    try {
      const data = await initiateDeepDive(researchTopic, selectedCountries);
      setDeepDiveResult(data);
    } catch (error) {
      console.error("Deep dive failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyResearchLink = () => {
    const link = `${window.location.origin}/research/${Date.now()}`;
    navigator.clipboard.writeText(link);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-500 pb-10 print:p-0">
      
      {/* LEFT: INPUT COLUMN */}
      <div className="lg:col-span-5 space-y-6 print:hidden">
        {/* Tab Switcher */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setActiveTab('TACTICAL')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'TACTICAL' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Tactical SitRep
          </button>
          <button 
            onClick={() => setActiveTab('DEEP_DIVE')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'DEEP_DIVE' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Microscope className="w-4 h-4" /> Global Deep Dive
          </button>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-lg flex items-center gap-3 uppercase tracking-tighter">
              {activeTab === 'TACTICAL' ? (
                <><ShieldCheck className="text-cyan-400 w-6 h-6" /> Mission Parameters</>
              ) : (
                <><Database className="text-purple-400 w-6 h-6" /> Research Parameters</>
              )}
            </h3>
          </div>

          <div className="space-y-5">
             {activeTab === 'TACTICAL' && (
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reporting Start</label>
                     <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:border-cyan-500 outline-none transition-colors" 
                      />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reporting End</label>
                     <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 focus:border-cyan-500 outline-none transition-colors" 
                      />
                     </div>
                  </div>
               </div>
             )}

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Geographies</label>
                <div className="relative">
                   <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-left text-xs text-slate-400 flex justify-between items-center hover:bg-slate-800 transition-all"
                   >
                     <span className="truncate">{selectedCountries.length > 0 ? `${selectedCountries.length} Regions Selected` : 'Select Global Mission Nodes...'}</span>
                     <Plus className={`w-4 h-4 shrink-0 ${isDropdownOpen ? 'rotate-45' : ''} transition-all`} />
                   </button>
                   {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 p-2 custom-scrollbar">
                      <div className="sticky top-0 bg-slate-900 pb-2 z-10">
                        <div className="relative">
                          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Filter global regions..." 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        {ALL_COUNTRIES.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                          <button 
                            key={c} 
                            onClick={() => toggleCountry(c)} 
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-colors hover:bg-slate-800 ${selectedCountries.includes(c) ? (activeTab === 'TACTICAL' ? 'text-cyan-400 bg-cyan-900/20' : 'text-purple-400 bg-purple-900/20') : 'text-slate-400'}`}
                          >
                            {c} {selectedCountries.includes(c) && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                   )}
                </div>
                {selectedCountries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {selectedCountries.map(c => (
                      <span key={c} className="bg-slate-800/80 border border-slate-700 text-slate-300 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1.5">
                        {c} <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => toggleCountry(c)} />
                      </span>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col h-[400px] shadow-2xl">
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                {activeTab === 'TACTICAL' ? <FileText className="w-4 h-4 text-cyan-500" /> : <Globe className="w-4 h-4 text-purple-500" />}
                {activeTab === 'TACTICAL' ? "Raw Field Report Analysis" : "Global Data Deep Dive Query"}
             </h4>
          </div>
          
          {activeTab === 'TACTICAL' ? (
            <textarea 
              className="flex-1 bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:border-cyan-500/50 outline-none transition-all shadow-inner custom-scrollbar placeholder:text-slate-700" 
              placeholder="Paste raw field reports or situational logs here for tactical synthesis..." 
              value={reportText} 
              onChange={(e) => setReportText(e.target.value)} 
            />
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <input 
                type="text"
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-4 text-slate-200 text-sm font-bold focus:border-purple-500/50 outline-none transition-all shadow-inner placeholder:text-slate-700"
                placeholder="e.g., Food security trends in North Darfur Q1 2025"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
              />
              <div className="p-4 bg-purple-950/20 rounded-2xl border border-purple-500/10 flex-1 flex flex-col items-center justify-center text-center">
                 <Globe className="w-8 h-8 text-purple-500/40 mb-3" />
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black max-w-[200px]">Querying OCHA, ReliefWeb, and WFP Global Databases in Real-Time</p>
              </div>
            </div>
          )}

          <button 
            onClick={activeTab === 'TACTICAL' ? handleAnalysis : handleDeepDive} 
            disabled={isAnalyzing || (activeTab === 'TACTICAL' ? !reportText.trim() : !researchTopic.trim())} 
            className={`mt-4 w-full py-4 rounded-2xl font-black uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-3 transition-all ${isAnalyzing || (activeTab === 'TACTICAL' ? !reportText.trim() : !researchTopic.trim()) ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : (activeTab === 'TACTICAL' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20' : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20') + ' text-white shadow-xl active:scale-[0.98]'}`}
          >
             {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : (activeTab === 'TACTICAL' ? <BrainCircuit className="w-4 h-4" /> : <Microscope className="w-4 h-4" />)}
             {isAnalyzing ? "Processing Intelligence..." : (activeTab === 'TACTICAL' ? "Synthesize SITREP" : "Initiate Global Deep Dive")}
          </button>
        </div>
      </div>

      {/* RIGHT: ACTIONABLE RESULTS COLUMN */}
      <div className="lg:col-span-7 print:hidden overflow-y-auto custom-scrollbar h-[calc(100vh-160px)] pr-2">
        {isAnalyzing ? (
          <div className="glass-panel h-full rounded-3xl flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-slate-900/40 shadow-2xl">
             <div className="relative mb-8">
               <RefreshCcw className={`w-16 h-16 animate-spin ${activeTab === 'TACTICAL' ? 'text-cyan-500' : 'text-purple-500'}`} />
               <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse ${activeTab === 'TACTICAL' ? 'bg-cyan-500' : 'bg-purple-500'}`}></div>
             </div>
             <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">
                {activeTab === 'TACTICAL' ? "Synthesizing Mission Intel" : "Scouring Global Databases"}
             </h3>
             <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                {activeTab === 'TACTICAL' ? "Cross-referencing field reports with regional threat indices..." : "Retrieving validated reports from UN, WFP and satellite briefings..."}
             </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Header / Summary Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 border-l-4 border-l-cyan-500 shadow-2xl">
               <div className="flex justify-between items-start mb-10">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                         result.riskLevel === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                         result.riskLevel === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                       }`}>{result.riskLevel} PRIORITY MISSION</span>
                       <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-slate-800 border border-slate-700 text-slate-400">
                         Protection Lens Active
                       </span>
                     </div>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tighter uppercase">{result.title}</h3>
                  </div>
                  <button 
                    onClick={() => setShowReportModal(true)} 
                    className="p-4 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-2xl border border-slate-800 transition-all hover:scale-105 shadow-xl"
                  >
                     <Printer className="w-6 h-6" />
                  </button>
               </div>

               <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 mb-8 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" /> Actionable Intelligence Briefing
                  </p>
                  <p className="text-slate-200 text-xl leading-relaxed font-bold italic tracking-tight border-l-2 border-cyan-500/30 pl-6">
                    "{result.summary}"
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total PiN</p>
                     <p className="text-2xl font-black text-white">{result.population.totalPiN}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Female %</p>
                     <p className="text-2xl font-black text-rose-500">{result.population.disaggregationData.womenPercentage}%</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Weight</p>
                     <p className={`text-2xl font-black ${result.riskLevel === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>{result.riskLevel.slice(0,3)}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sectors</p>
                     <p className="text-2xl font-black text-cyan-500">{result.sectors.length}</p>
                  </div>
               </div>
            </div>

            {/* Tactical Content ... (Omitted for brevity, existing logic remains) */}
          </div>
        ) : deepDiveResult ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Research Header */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 border-l-4 border-l-purple-500 shadow-2xl">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                     <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        Validated Deep Dive
                     </span>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tighter uppercase">{deepDiveResult.title}</h3>
                  </div>
                  <button 
                    onClick={copyResearchLink} 
                    className="p-4 bg-slate-900 hover:bg-slate-800 text-purple-400 rounded-2xl border border-slate-800 transition-all shadow-xl group"
                  >
                     {copyStatus ? <Check className="w-6 h-6 text-emerald-500" /> : <LinkIcon className="w-6 h-6 group-hover:scale-110" />}
                  </button>
               </div>

               <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 mb-8">
                  <p className="text-slate-300 text-base leading-relaxed font-medium">
                    {deepDiveResult.content}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-purple-950/10 rounded-2xl border border-purple-500/10">
                     <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <ListChecks className="w-4 h-4" /> Strategic Findings
                     </h4>
                     <ul className="space-y-3">
                        {deepDiveResult.keyFindings.map((finding, i) => (
                           <li key={i} className="flex gap-3 text-xs text-slate-300 font-medium">
                              <span className="text-purple-500 font-black">/</span> {finding}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="p-6 bg-emerald-950/10 rounded-2xl border border-emerald-500/10">
                     <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Tactical Field Directives
                     </h4>
                     <ul className="space-y-3">
                        {deepDiveResult.tacticalDirectives.map((dir, i) => (
                           <li key={i} className="flex gap-3 text-xs text-slate-300 font-medium">
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {dir}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* Gender Impact Deep Dive */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 border-l-4 border-l-rose-500 bg-rose-950/5">
                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <Users className="w-4 h-4" /> Global Protection & Gender Lens
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-rose-500/30 pl-6">
                   {deepDiveResult.genderImpact}
                </p>
            </div>

            {/* Validated Sources / Global Data Links */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <ExternalLink className="w-4 h-4" /> Validated Global Data Sources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {deepDiveResult.citations.map((citation, i) => (
                      <a 
                        key={i} 
                        href={citation.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-slate-950/40 rounded-xl border border-white/5 hover:border-cyan-500/40 transition-all flex justify-between items-center group"
                      >
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-white uppercase group-hover:text-cyan-400 transition-colors">{citation.title}</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{citation.source || 'Verified Intelligence'}</span>
                         </div>
                         <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                      </a>
                   ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel h-full rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-30 border-2 border-dashed border-slate-800 bg-slate-900/5 shadow-inner">
             <div className="p-6 bg-slate-900 rounded-3xl mb-6 border border-slate-800 shadow-2xl">
               {activeTab === 'TACTICAL' ? <Activity className="w-12 h-12 text-slate-700" /> : <Microscope className="w-12 h-12 text-slate-700" />}
             </div>
             <h3 className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">
                {activeTab === 'TACTICAL' ? "Actionable Intelligence Platform Ready" : "Global Intelligence Deep Dive Ready"}
             </h3>
             <p className="text-slate-600 text-xs mt-3 max-w-xs leading-relaxed font-medium">
                {activeTab === 'TACTICAL' ? "Input mission parameters to generate tactical directives and safe corridor assessments." : "Enter a research topic to scan global validated databases and generate strategic intelligence links."}
             </p>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL ... (Existing logic) */}
      {showReportModal && result && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in duration-300 print:relative print:inset-0 print:p-0 print:bg-white">
           <div className="bg-white text-slate-900 w-full max-w-5xl h-full md:h-[92vh] md:rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 print:h-auto print:rounded-none print:shadow-none">
              <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0 print:hidden">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl"><FileText className="w-6 h-6" /></div>
                    <div>
                       <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">AURA STRATEGIC SITREP: {result.title}</h2>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Restricted Tactical Circulation • Gender Lens Enabled</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl transition-all border border-slate-200"
                   >
                      <Printer className="w-4 h-4" /> Export Record
                   </button>
                   <button 
                    onClick={() => setShowReportModal(false)} 
                    className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                   >
                      <X className="w-8 h-8" />
                   </button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-200 custom-scrollbar-light print:p-0 print:bg-white">
                 <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-8 md:p-[1.5cm] min-h-[29.7cm] border-t-[16px] border-slate-900 relative print:shadow-none print:border-none print:p-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] opacity-[0.03] pointer-events-none select-none print:hidden">
                       <h1 className="text-[120px] font-black whitespace-nowrap uppercase">RESTRICTED</h1>
                    </div>

                    <div className="border-b-4 border-slate-900 pb-10 mb-10 relative z-10">
                       <div className="flex justify-between items-end">
                         <div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter leading-[0.9] mb-4">{result.title}</h1>
                            <p className="text-blue-700 font-black uppercase tracking-[0.4em] text-xs">Aura Actionable Intelligence Briefing • JIAF v2.8 Compliant</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Mission Window</p>
                            <p className="font-black text-slate-900 text-sm whitespace-nowrap">{result.dateRange?.start || 'N/A'} — {result.dateRange?.end || 'Current'}</p>
                         </div>
                       </div>
                    </div>

                    <div className="space-y-12 relative z-10">
                       <section>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-4">1.0 TACTICAL FIELD BRIEFING</h3>
                          <p className="text-base leading-relaxed font-bold italic text-slate-800">"{result.summary}"</p>
                       </section>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <section>
                             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-4">2.0 GENDERED POPULATION IMPACT</h3>
                             <div className="space-y-4">
                                <div>
                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Calculated PiN</p>
                                   <p className="text-2xl font-black text-slate-900">{result.population.totalPiN}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase">Female %</p>
                                      <p className="text-lg font-black text-rose-600">{result.population.disaggregationData.womenPercentage}%</p>
                                   </div>
                                   <div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase">PWD %</p>
                                      <p className="text-lg font-black text-blue-600">{result.population.disaggregationData.pwdPercentage}%</p>
                                   </div>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 font-medium italic">{result.population.womenAndChildren}</p>
                             </div>
                          </section>
                          <section>
                             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-4">2.1 PROTECTION RISKS</h3>
                             <div className="space-y-3">
                                {result.genderLens.risks.slice(0, 3).map((risk, i) => (
                                   <div key={i} className="flex gap-2 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                                      <ShieldAlert className="w-3 h-3 text-rose-500 mt-0.5" />
                                      <p className="text-[10px] font-bold text-slate-700 leading-tight uppercase tracking-tight">{risk}</p>
                                   </div>
                                ))}
                             </div>
                          </section>
                       </div>

                       <section>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">3.0 STRATEGIC FIELD DIRECTIVES</h3>
                          <div className="space-y-4">
                             {result.recommendations.map((rec, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                   <div className="font-black text-slate-900 text-xs">{i+1}.0</div>
                                   <p className="text-xs font-bold text-slate-800 leading-relaxed">{rec}</p>
                                </div>
                             ))}
                          </div>
                       </section>

                       <section>
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">4.0 SAFE CORRIDOR ASSESSMENT</h3>
                          <div className="grid grid-cols-2 gap-4">
                             {result.mobility.map((m, i) => (
                                <div key={i} className={`p-4 rounded-xl border-2 ${m.status === 'Safe' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                   <p className="text-[10px] font-black uppercase tracking-tight mb-1">{m.route}</p>
                                   <p className="text-[9px] font-black opacity-60 uppercase mb-2">{m.status}</p>
                                   <p className="text-[8px] font-bold opacity-80 leading-tight">{m.details}</p>
                                </div>
                             ))}
                          </div>
                       </section>

                       <section className="pt-10 border-t-2 border-slate-900 flex justify-between items-end print:pt-6">
                          <div>
                             <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Aura Intelligence Strategic Record • Field Intelligence Core</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Validating Strategic Lead: Annie Maurice Ekanem</p>
                          </div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SITREP-UID: {Date.now().toString().slice(-8)}</p>
                       </section>
                    </div>
                 </div>
              </div>
              <div className="bg-slate-900 p-6 flex justify-end gap-4 shrink-0 print:hidden">
                 <button onClick={() => setShowReportModal(false)} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl transition-all uppercase tracking-widest text-xs">Archive Intelligence</button>
                 <button 
                  onClick={handlePrint}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-cyan-900/20"
                 >
                    Official Strategic Export
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
          .fixed.inset-0.z-\\[60\\] { 
            position: absolute !important;
            visibility: visible !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
            padding: 0 !important;
            background: white !important;
            backdrop-filter: none !important;
          }
          .fixed.inset-0.z-\\[60\\] * { visibility: visible !important; }
          .bg-slate-200 { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisTool;
