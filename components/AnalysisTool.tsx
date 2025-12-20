
import React, { useState, useEffect, useRef } from 'react';
import { generateGlobalIntel, generateDeepDive, alignReferenceContext, fetchRealtimeGrounding } from '../services/gemini';
import { AnalysisResult, DeepDiveResult, Citation } from '../types';
import { 
  FileText, Search, Calendar, Globe, CheckCircle2, RefreshCcw, X, Activity,
  Printer, ShieldCheck, Zap, AlertTriangle, Target, Microscope, Upload,
  ExternalLink, Clock, ChevronDown, Info, Key, MapPin, BookOpen, Fingerprint, Sparkles, Send, TrendingUp, Package, Droplets, HeartPulse, Shield, Layers, FileSearch, ChartBar, BrainCircuit, Database, Wand2, Sparkle,
  Accessibility, Baby, Users
} from 'lucide-react';
import { ALL_COUNTRIES, HUMANITARIAN_CONTEXT_DEC_2025 } from '../constants';

const AnalysisTool = () => {
  const [activeTab, setActiveTab] = useState<'TACTICAL' | 'DEEP_DIVE'>('TACTICAL');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('2025-12-03');
  const [endDate, setEndDate] = useState('2025-12-10');
  const [reportText, setReportText] = useState(HUMANITARIAN_CONTEXT_DEC_2025);
  const [researchTopic, setResearchTopic] = useState('');
  const [deepDiveTopic, setDeepDiveTopic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAligningContext, setIsAligningContext] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [deepDiveResult, setDeepDiveResult] = useState<DeepDiveResult | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isContextPruned, setIsContextPruned] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        try {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(selected);
        } catch (e) { console.error(e); }
      }
    };
    checkKey();
  }, []);

  const isContextAligned = selectedCountries.every(c => reportText.toLowerCase().includes(c.toLowerCase()));

  const handleSmartFetch = async () => {
    if (selectedCountries.length === 0) return;
    setIsAligningContext(true);
    try {
      const freshContext = await fetchRealtimeGrounding(
        selectedCountries,
        startDate,
        endDate
      );
      setReportText(freshContext);
      setIsContextPruned(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAligningContext(false);
    }
  };

  const handleAlignContext = async () => {
    if (selectedCountries.length === 0) return;
    setIsAligningContext(true);
    try {
      const aligned = await alignReferenceContext(
        reportText, 
        selectedCountries, 
        startDate, 
        endDate
      );
      setReportText(aligned);
      setIsContextPruned(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAligningContext(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setReportText(prev => prev + `\n[Reference Data Uploaded: ${files.map(f => f.name).join(', ')}]`);
    }
  };

  const handleGenerateIntelligence = async () => {
    if (selectedCountries.length === 0 && !researchTopic && !deepDiveTopic) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setDeepDiveResult(null);
    setAnalysisStatus('Initiating Grounded Intelligence Pulse...');

    const statuses = [
      'Accessing Grounded Risk Briefings...',
      'Synthesizing Gender & Protection Lens...',
      'Quantifying Vulnerability Metrics...',
      'Generating Sectoral Response Directives...',
      'Finalizing Strategic Directives...'
    ];

    let statusIdx = 0;
    const interval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setAnalysisStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 2000);

    try {
      if (activeTab === 'TACTICAL') {
        const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
        const data = await generateGlobalIntel(
          researchTopic || "Strategic Risk Snapshot", 
          selectedCountries, 
          reportText, 
          dateRange
        );
        setResult(data);
      } else {
        const descriptiveContext = `Strategic trajectory assessment based on: ${reportText}`;
        const data = await generateDeepDive(
          deepDiveTopic || "6-Month Strategic Trajectory",
          selectedCountries,
          descriptiveContext
        );
        setDeepDiveResult(data);
      }
    } catch (error) { 
      console.error("Intelligence failure:", error); 
    } finally { 
      clearInterval(interval);
      setIsAnalyzing(false); 
      setAnalysisStatus('');
    }
  };

  const saveReportToHistory = (report: AnalysisResult) => {
    const history = JSON.parse(localStorage.getItem('aura_reports_history') || '[]');
    const newReport = {
      ...report,
      reportId: `aura-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aura_reports_history', JSON.stringify([newReport, ...history]));
    alert("Intelligence Record saved to Strategic Archive.");
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in duration-700 pb-10 max-w-7xl mx-auto">
      
      {/* MISSION CONTROL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/60 p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] pointer-events-none"></div>
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
                <BrainCircuit className="text-white w-5 h-5" />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Predictive Intelligence Hub</h2>
          </div>
          <div className="flex gap-4 border-b border-white/5 pb-2">
            <button 
              onClick={() => setActiveTab('TACTICAL')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all border-b-2 ${activeTab === 'TACTICAL' ? 'text-white border-cyan-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Tactical SITREP
            </button>
            <button 
              onClick={() => setActiveTab('DEEP_DIVE')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all border-b-2 ${activeTab === 'DEEP_DIVE' ? 'text-white border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
              Strategic Trajectory
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest self-center mr-2">Nodes Under Analysis:</span>
            {selectedCountries.length > 0 ? (
              selectedCountries.map(c => (
                <span key={c} className="bg-cyan-600/10 text-cyan-400 border border-cyan-600/20 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 animate-in zoom-in-95">
                  <MapPin className="w-3 h-3" /> {c} <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCountries(p => p.filter(x => x !== c))} />
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Standby • Configure Geographic Context</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* CONFIGURATION PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6 shadow-2xl border-l-4 border-l-cyan-600/50">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-500" /> Grounding Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2" ref={dropdownRef}>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Crisis Nodes</label>
                <div className="relative">
                   <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-left text-xs text-slate-300 font-bold flex justify-between items-center hover:border-cyan-500 transition-all ${isDropdownOpen ? 'border-cyan-500 ring-2 ring-cyan-500/10' : ''}`}
                   >
                     <span className="truncate">{selectedCountries.length > 0 ? selectedCountries.join(', ') : 'Select Affected Regions...'}</span>
                     <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-[60] p-2 custom-scrollbar animate-in slide-in-from-top-2">
                      <div className="sticky top-0 bg-slate-900 pb-2 z-10">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Search regions..." 
                            className="w-full bg-slate-800 border-none rounded-xl px-10 py-2.5 text-xs text-slate-200 outline-none" 
                            value={countrySearch} 
                            onChange={(e) => setCountrySearch(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        {filteredCountries.map(c => (
                          <button 
                            key={c} 
                            onClick={(e) => { e.stopPropagation(); setSelectedCountries(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]); }} 
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex justify-between items-center transition-colors ${selectedCountries.includes(c) ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                          >
                            <span>{c}</span>
                            {selectedCountries.includes(c) && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Window Start</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-[10px] text-white outline-none focus:border-cyan-500 transition-all appearance-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Window End</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-[10px] text-white outline-none focus:border-cyan-500 transition-all appearance-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Analytical Lens</label>
                <input 
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                  placeholder={activeTab === 'TACTICAL' ? "e.g. Impact of fuel shortages on health" : "e.g. Strategic trajectory of returnee flows"}
                  value={activeTab === 'TACTICAL' ? researchTopic : deepDiveTopic}
                  onChange={(e) => activeTab === 'TACTICAL' ? setResearchTopic(e.target.value) : setDeepDiveTopic(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-xl border-l-4 border-l-emerald-600/50">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-500" /> Validated Reference Context
                </h3>
                <div className="flex gap-2">
                  <button onClick={handleAlignContext} disabled={isAligningContext || selectedCountries.length === 0} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-400"><Wand2 className="w-4 h-4" /></button>
                  <button onClick={handleSmartFetch} disabled={isAligningContext || selectedCountries.length === 0} className={`p-2 rounded-lg border transition-all ${!isContextAligned && selectedCountries.length > 0 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}><Sparkles className="w-4 h-4" /></button>
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-400"><Upload className="w-4 h-4" /></button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
             </div>
             <div className="relative">
                <textarea 
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-slate-300 font-medium text-[10px] leading-relaxed resize-none h-48 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 custom-scrollbar" 
                  value={reportText} 
                  onChange={(e) => setReportText(e.target.value)} 
                />
                {!isContextAligned && selectedCountries.length > 0 && <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-500 text-[8px] font-black uppercase rounded flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Out of Sync</div>}
             </div>
          </div>
          
          <button 
            onClick={handleGenerateIntelligence}
            disabled={isAnalyzing || (selectedCountries.length === 0 && !researchTopic && !deepDiveTopic)}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group
              ${isAnalyzing ? 'bg-slate-800 text-slate-600' : (activeTab === 'TACTICAL' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-emerald-600 hover:bg-emerald-500') + ' text-white hover:scale-[1.02] active:scale-95'}
            `}
          >
            {isAnalyzing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (activeTab === 'TACTICAL' ? <Sparkles className="w-5 h-5" /> : <Microscope className="w-5 h-5" />)}
            {isAnalyzing ? 'Synthesizing Records...' : (activeTab === 'TACTICAL' ? 'Generate Intelligence Report' : 'Execute Strategic Deep Dive')}
          </button>
        </div>

        {/* OUTPUT FEED */}
        <div className="lg:col-span-8 overflow-y-auto custom-scrollbar h-[calc(100vh-280px)] pr-2">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-[3rem] border-dashed border-2 border-slate-800 bg-slate-900/20">
               <div className="relative mb-12">
                 <div className={`w-32 h-32 border-4 ${activeTab === 'TACTICAL' ? 'border-cyan-500/10 border-t-cyan-500' : 'border-emerald-500/10 border-t-emerald-500'} rounded-full animate-spin`}></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <BrainCircuit className={`w-12 h-12 ${activeTab === 'TACTICAL' ? 'text-cyan-500' : 'text-emerald-500'} animate-pulse`} />
                 </div>
               </div>
               <h3 className="text-white font-black text-2xl uppercase tracking-[0.2em] mb-4">{analysisStatus}</h3>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm">Aggregating OCHA Ground Truth with Aura Predictive Telemetry...</p>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 pb-12">
               <div className="glass-panel p-10 rounded-[3rem] border-l-[12px] border-l-cyan-600 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/5 blur-[120px] pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-10 border-b border-slate-800/60 pb-8 relative z-10">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-cyan-600/10 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">Aura SITREP v3.5 • Dec 2025</span>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Protection Prioritized</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase">{result.title}</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => saveReportToHistory(result)} className="p-4 bg-emerald-600 text-white rounded-2xl hover:scale-110 transition-all shadow-2xl flex flex-col items-center gap-1 group">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Archive Intel</span>
                      </button>
                      <button onClick={() => setShowReportModal(true)} className="p-4 bg-white text-slate-900 rounded-2xl hover:scale-110 transition-all shadow-2xl flex flex-col items-center gap-1 group">
                        <FileText className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Full Record</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-200 text-xl leading-relaxed font-black italic border-l-4 border-cyan-500/40 pl-8 mb-12 opacity-90 prose-humanitarian">
                    "{result.summary}"
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                    <ResultKPI label="Verified Needs" value={result.population.totalPiN} sub="Total PiN" />
                    <ResultKPI label="Risk Index" value={result.riskLevel} color={result.riskLevel === 'Critical' ? 'text-rose-500' : 'text-amber-500'} sub="Crisis Severity" />
                    <ResultKPI label="Protection Load" value={`${(result.population.disaggregationData.womenPercentage + result.population.disaggregationData.childrenPercentage + result.population.disaggregationData.pwdPercentage).toFixed(0)}%`} sub="Vulnerability Pool" />
                    <ResultKPI label="Impact Cycle" value="14 Days" sub="Predictive Window" />
                  </div>
               </div>

               {/* PROTECTION & GENDER DASHBOARD */}
               <div className="glass-panel p-8 rounded-[2.5rem] shadow-xl space-y-6 border-l-[12px] border-l-rose-600 relative overflow-hidden bg-rose-950/5">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Accessibility className="w-48 h-48 text-white" />
                  </div>
                  <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] flex items-center gap-3 border-b border-rose-500/10 pb-4">
                     <Accessibility className="w-5 h-5" /> Protection & Gender Lens (Mandatory Audit)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3 mb-4">
                          <Users className="w-5 h-5 text-rose-400" />
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Women's Safety</h4>
                       </div>
                       <p className="text-xs text-slate-200 font-bold leading-relaxed">{result.population.womenAndChildren.split('.')[0]}.</p>
                       <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-4">Demographic: {result.population.disaggregationData.womenPercentage}%</p>
                    </div>
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3 mb-4">
                          <Baby className="w-5 h-5 text-cyan-400" />
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Child Protection</h4>
                       </div>
                       <p className="text-xs text-slate-200 font-bold leading-relaxed">{result.population.womenAndChildren.split('.')[1] || result.population.womenAndChildren}.</p>
                       <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mt-4">Demographic: {result.population.disaggregationData.childrenPercentage}%</p>
                    </div>
                    <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3 mb-4">
                          <Accessibility className="w-5 h-5 text-amber-400" />
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PWD & Accessibility</h4>
                       </div>
                       <p className="text-xs text-slate-200 font-bold leading-relaxed">{result.population.elderlyAndPWD}</p>
                       <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-4">Demographic: {result.population.disaggregationData.pwdPercentage}%</p>
                    </div>
                  </div>
                  <div className="bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20">
                     <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">Critical Protection Directives</h4>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.genderLens.protectionDirectives.map((d, i) => (
                           <li key={i} className="flex gap-2 text-[10px] text-slate-200 font-bold"><span className="text-rose-500">•</span> {d}</li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* SECTORAL DEEP DIVE */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {result.sectors.map((sector, i) => (
                   <div key={i} className="glass-panel p-6 rounded-[2rem] space-y-4 border-l-4 border-cyan-500/20">
                      <div className="flex justify-between items-center">
                         <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                           <Activity className="w-3.5 h-3.5" /> {sector.sector}
                         </h4>
                         <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">{sector.severity}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-bold italic">"{sector.findings}"</p>
                      <div className="pt-2 border-t border-white/5">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Response</p>
                         <p className="text-[10px] text-cyan-300 font-bold">{sector.intervention}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          ) : deepDiveResult ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 pb-12">
               <div className="glass-panel p-10 rounded-[3rem] border-l-[12px] border-l-emerald-600 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/5 blur-[120px] pointer-events-none"></div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter uppercase mb-6">{deepDiveResult.title}</h2>
                  <p className="text-slate-200 text-xl leading-relaxed font-black italic border-l-4 border-emerald-500/40 pl-8 opacity-90 prose-humanitarian">
                    "{deepDiveResult.summary}"
                  </p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {deepDiveResult.regionalTrends.map((trend, i) => (
                   <div key={i} className="glass-panel p-8 rounded-[2rem] space-y-4">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {trend.region} Trajectory
                      </h4>
                      <ul className="space-y-3">
                        {trend.trends.map((t, idx) => (
                          <li key={idx} className="flex gap-3 text-xs text-slate-300 font-bold leading-relaxed"><span className="text-emerald-500 font-black shrink-0">•</span> {t}</li>
                        ))}
                      </ul>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
               <div className="w-24 h-24 bg-slate-800/50 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-700/50">
                 <FileSearch className="w-12 h-12 text-slate-600" />
               </div>
               <h3 className="text-slate-500 font-black uppercase tracking-[0.5em] text-xl">System Standby</h3>
               <p className="text-slate-600 text-sm mt-6 font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                 Configure nodes and window start/end to initiate the predictive intelligence synthesis engine.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* STRATEGIC RECORD MODAL */}
      {showReportModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-slate-950/98 backdrop-blur-2xl">
           <div className="bg-white text-slate-900 w-full max-w-5xl h-full md:h-[94vh] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="bg-slate-100 border-b border-slate-200 px-10 py-6 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-5">
                   <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl"><FileText className="w-8 h-8" /></div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1 leading-none">STRATEGIC RECORD</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Predictive Intelligence Cycle • 2025</p>
                   </div>
                 </div>
                 <button onClick={() => setShowReportModal(false)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-200 custom-scrollbar-light">
                 <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-8 md:p-[1.5cm] min-h-[29.7cm] border-t-[20px] border-slate-900 relative">
                    <div className="border-b-4 border-slate-900 pb-12 mb-12">
                       <h1 className="text-5xl font-black uppercase text-slate-900 tracking-tighter leading-tight mb-4">{result.title}</h1>
                       <div className="flex flex-wrap gap-4">
                          <span className="text-rose-600 font-black uppercase tracking-[0.4em] text-xs">Priority Protection Case</span>
                          <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">JIAF v2.8 Standard</span>
                       </div>
                    </div>
                    <div className="space-y-12 pb-20">
                       <section>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">1.0 PROTECTION LENS AUDIT</h3>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                                <h4 className="text-[10px] font-black text-rose-600 uppercase mb-3">A. Women & Children Vulnerability</h4>
                                <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{result.population.womenAndChildren}"</p>
                             </div>
                             <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                <h4 className="text-[10px] font-black text-amber-600 uppercase mb-3">B. Disability & Elderly Accessibility</h4>
                                <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{result.population.elderlyAndPWD}"</p>
                             </div>
                          </div>
                       </section>
                       <section>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-100 pb-2 mb-6">2.0 QUANTIFIED SUPPLY FORECAST</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {result.supplyForecasting.map((f, i) => (
                              <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{f.category}</p>
                                <p className="font-black text-slate-900 text-sm">{f.item}</p>
                                <div className="flex items-baseline gap-2 mt-2">
                                   <span className="text-2xl font-black text-cyan-700">{f.quantityNeeded}</span>
                                   <span className="text-[10px] font-black text-slate-500 uppercase">{f.unit}</span>
                                </div>
                                <p className="text-[9px] text-slate-500 mt-2 italic">{f.gapAnalysis}</p>
                              </div>
                            ))}
                          </div>
                       </section>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ResultKPI = ({ label, value, sub, color = 'text-white' }: any) => (
  <div className="bg-slate-950/40 p-6 rounded-3xl border border-white/5 group hover:border-cyan-500/30 transition-all shadow-inner">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{label}</p>
    <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2">{sub}</p>
  </div>
);

export default AnalysisTool;
