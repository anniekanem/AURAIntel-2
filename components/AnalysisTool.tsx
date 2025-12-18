
import React, { useState } from 'react';
import { analyzeFieldReport, generateRiskBriefing } from '../services/gemini';
import { AnalysisResult, SavedReport } from '../types';
import { FileText, Cpu, CheckCircle2, AlertTriangle, Shield, ArrowRight, Globe, Plus, X, Sparkles, BrainCircuit, GitMerge, ExternalLink, Search, Calendar, Heart, Droplets, Tent, Truck, Utensils, BookOpen, Component, Wifi, Briefcase, MapPin, PackageCheck, Navigation, Timer, Hourglass, RotateCcw, Download, Printer, XCircle, Linkedin, Facebook, Twitter, Share2, Copy, Users, Baby, Scale, Accessibility, BarChart3, PieChart, ClipboardList } from 'lucide-react';
import { ALL_COUNTRIES } from '../constants';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RePie, Pie } from 'recharts';

const SAMPLE_REPORT = `Regional Risk Briefing: 3–10 December 2025
Key Verified Incident Trends:
Sudan (North Darfur / El Fasher–Tawila Axis):
Fighting around El Fasher continued with repeated strikes on health and WASH sites. Humanitarian partners reported severe shortages of fuel for generators, limited trauma supplies, and rapidly increasing latrine-to-user ratios in overcrowded shelters holding approx 15,000 newly displaced persons. Route 4 south of El Fasher is compromised by checkpoints.

Eastern DRC (North Kivu / Ituri):
Armed-group attacks in rural Lubero and Mambasa generated new casualties and displacement toward Beni and Komanda. Access disruptions continued along the Beni–Butembo corridor (blocked by debris). However, the secondary route via Komanda remains open for supply convoys.

Nigeria (Northwest & Northeast):
Banditry insurgent hybrid attacks persisted. 5,000 households in Maiduguri require immediate food assistance.

Priority Actions (Top 8):
1. Front-load flexible funding for trauma care, water trucking, essential medicines.
2. Secure predictable corridor agreements.`;

const AnalysisTool = () => {
  const [reportText, setReportText] = useState(SAMPLE_REPORT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [generatedCitations, setGeneratedCitations] = useState<{title: string, uri: string}[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'policymaker'>('standard');
  
  // Region Selection State
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date Selection State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  const filteredCountries = ALL_COUNTRIES.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveReportToHistory = (data: AnalysisResult) => {
    try {
      const history = JSON.parse(localStorage.getItem('aura_reports_history') || '[]');
      const newReport: SavedReport = {
        ...data,
        reportId: `REP-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newReport, ...history].slice(0, 50); // Keep last 50
      localStorage.setItem('aura_reports_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save report history", e);
    }
  };

  const getSectorIcon = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes('health') || s.includes('med')) return <Heart className="w-4 h-4 text-rose-400" />;
    if (s.includes('wash') || s.includes('water') || s.includes('sanitation') || s.includes('hygiene')) return <Droplets className="w-4 h-4 text-blue-400" />;
    if (s.includes('shelter') || s.includes('nfi') || s.includes('housing')) return <Tent className="w-4 h-4 text-amber-400" />;
    if (s.includes('protection') || s.includes('gbv') || s.includes('child') || s.includes('rights')) return <Shield className="w-4 h-4 text-purple-400" />;
    if (s.includes('nutrition') || s.includes('malnutrition')) return <Component className="w-4 h-4 text-pink-400" />;
    if (s.includes('food') || s.includes('fsl')) return <Utensils className="w-4 h-4 text-green-400" />;
    if (s.includes('logistic') || s.includes('transport')) return <Truck className="w-4 h-4 text-slate-400" />;
    if (s.includes('education') || s.includes('learning') || s.includes('school')) return <BookOpen className="w-4 h-4 text-cyan-400" />;
    if (s.includes('telecommunication') || s.includes('etc') || s.includes('comms')) return <Wifi className="w-4 h-4 text-indigo-400" />;
    if (s.includes('recovery') || s.includes('livelihood') || s.includes('economic')) return <Briefcase className="w-4 h-4 text-emerald-500" />;
    return <Component className="w-4 h-4 text-slate-400" />;
  };

  const handleGenerateBriefing = async () => {
    if (selectedCountries.length === 0) return;
    setIsGenerating(true);
    setIsDropdownOpen(false);
    setGeneratedCitations([]);

    const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
    const { text, citations } = await generateRiskBriefing(selectedCountries, dateRange);
    
    setReportText(text);
    setGeneratedCitations(citations);
    setIsGenerating(false);
  };

  const handleAnalysis = async () => {
    if (!reportText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setViewMode('standard');
    
    try {
      const minTime = new Promise(resolve => setTimeout(resolve, 1500));
      const analysisPromise = analyzeFieldReport(reportText);
      const [_, data] = await Promise.all([minTime, analysisPromise]);
      setResult(data);
      saveReportToHistory(data);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSitRepText = (data: AnalysisResult) => {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let text = `OFFICIAL SITUATION REPORT (SITREP)\nDATE: ${dateStr}\nSUBJECT: ${data.title || 'Situation Analysis'}\nRISK LEVEL: ${data.riskLevel.toUpperCase()}\n\n`;
    text += `1. EXECUTIVE SUMMARY\n-------------------\n${data.summary}\n\n`;
    if (data.vulnerableGroups) {
        text += `A. VULNERABLE POPULATIONS:\n   - Women & Children: ${data.vulnerableGroups.womenAndChildren}\n   - PWD Accessibility: ${data.vulnerableGroups.peopleWithDisabilities}\n`;
        if (data.vulnerableGroups.specificNeeds && data.vulnerableGroups.specificNeeds.length > 0) {
            text += `   - QUANTIFIED NEEDS:\n`;
            data.vulnerableGroups.specificNeeds.forEach(need => { text += `     * ${need}\n`; });
        }
        text += `\n`;
    }
    text += `3. SECTOR-SPECIFIC NEEDS ANALYSIS\n-------------------\n`;
    data.sectoralAnalysis.forEach(sec => { text += `[${sec.sector}] Risk: ${sec.identifiedRisk} | Intervention: ${sec.recommendedIntervention}\n`; });
    text += `\n4. OPERATIONAL TIMELINE\n-------------------\nImmediate: ${data.timeline.immediate}\nPrep: ${data.timeline.preparedness}\nTurnaround: ${data.timeline.turnaround}\n\n`;
    text += `5. LOGISTICS\n-------------------\n`;
    data.logistics.forEach(log => { text += `- ${log.item}: ${log.quantity} for ${log.beneficiaries} (${log.urgency})\n`; });
    text += `\n6. MOBILITY\n-------------------\n`;
    data.mobility.forEach(mob => { text += `- ${mob.route} [${mob.status.toUpperCase()}] - ${mob.details}\n`; });
    text += `\n*** END OF REPORT ***`;
    return text;
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (!result) return;
    const currentUrl = window.location.href; 
    let url = '';
    if (platform === 'twitter') {
      const tweetBody = `🚨 SITREP: ${result.title.substring(0, 50)}...\n📍 Risk: ${result.riskLevel.toUpperCase()}\n#Humanitarian #AuraIntel`;
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetBody)}`;
    } else if (platform === 'linkedin') {
      const linkedInBody = `📄 OFFICIAL INTELLIGENCE REPORT\nSUBJECT: ${result.title}\nRISK LEVEL: ${result.riskLevel.toUpperCase()}\n\n${result.summary}\n\n#AuraIntel`;
      url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInBody)}`;
    } else if (platform === 'facebook') {
       url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    }
    window.open(url, '_blank', 'width=600,height=500');
  };

  const downloadTxtFile = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([generateSitRepText(result)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `SitRep_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element); 
    element.click();
  };

  const PolicymakerVisuals = ({ data }: { data: AnalysisResult }) => {
    const urgencyData = [
      { name: 'Critical', value: data.logistics.filter(l => l.urgency === 'Critical').length || 1, fill: '#ef4444' },
      { name: 'High', value: data.logistics.filter(l => l.urgency === 'High').length || 1, fill: '#f97316' },
      { name: 'Medium', value: data.logistics.filter(l => l.urgency === 'Medium').length || 1, fill: '#eab308' },
    ];
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700">
           <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
             <BarChart3 className="w-4 h-4 text-cyan-400" /> Resource Urgency Distribution
           </h4>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={urgencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={60} />
                  <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {urgencyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700">
             <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
               <PieChart className="w-4 h-4 text-purple-400" /> Gap Analysis (Logistics)
             </h4>
             <div className="h-48 w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {urgencyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                   </RePieChart>
                </ResponsiveContainer>
             </div>
           </div>
           <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Strategic Timeline</h4>
              <div className="space-y-4">
                 <div className="relative pl-4 border-l-2 border-red-500">
                    <span className="text-xs text-red-400 font-bold uppercase">Immediate</span>
                    <p className="text-sm text-white mt-1">{data.timeline.immediate}</p>
                 </div>
                 <div className="relative pl-4 border-l-2 border-orange-500">
                    <span className="text-xs text-orange-400 font-bold uppercase">Preparedness</span>
                    <p className="text-sm text-white mt-1">{data.timeline.preparedness}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };
  
  const RePieChart = RePie;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full relative">
      {showReportModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-white text-slate-900 w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-slate-100 border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <FileText className="text-slate-700 w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Formal Situation Report</h2>
                      <p className="text-sm text-slate-500">Preview & Share</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => shareToSocial('twitter')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Twitter className="w-4 h-4" /></button>
                    <button onClick={downloadTxtFile} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-medium text-slate-700">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg"><X className="w-6 h-6" /></button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200 custom-scrollbar-light">
                 <div className="max-w-[21cm] mx-auto bg-white shadow-lg p-[1cm] md:p-[2cm] min-h-[29.7cm]">
                    <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                       <div><h1 className="text-3xl font-bold text-slate-900">SITUATION ANALYSIS</h1></div>
                       <div className="text-right"><p className="text-sm font-bold text-slate-900">DATE: {new Date().toLocaleDateString()}</p></div>
                    </div>
                    <div className="mb-8 p-4 bg-slate-50 border-l-4 border-slate-900">
                       <h2 className="text-xl font-bold text-slate-900 mb-2">{result.title}</h2>
                       <div className="flex gap-4 text-sm"><span className="font-bold uppercase">RISK: <span className={result.riskLevel === 'Critical' ? 'text-red-600' : 'text-orange-600'}>{result.riskLevel}</span></span></div>
                    </div>
                    <div className="space-y-6">
                       <section><h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">1. Executive Summary</h3><p className="text-sm text-slate-700">{result.summary}</p></section>
                       <section><h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-1 mb-2">2. Vulnerability Focus</h3><p className="text-sm text-slate-700">{result.vulnerableGroups?.womenAndChildren}</p></section>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col h-full space-y-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 relative z-20">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2"><Search className="text-cyan-400 w-5 h-5" /> Deep Research & Briefing</h3>
          <div className="relative space-y-4">
             <div className="flex flex-wrap gap-2 min-h-[32px]">
               {selectedCountries.map(c => <span key={c} className="bg-cyan-900/40 text-cyan-300 text-sm px-3 py-1.5 rounded-lg border border-cyan-800 flex items-center gap-2">{c}<button onClick={() => toggleCountry(c)} className="hover:text-white p-0.5"><X className="w-3.5 h-3.5" /></button></span>)}
             </div>
             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-left text-sm text-slate-300 flex justify-between items-center transition-colors"><span>{isDropdownOpen ? 'Close list' : 'Select Countries...'}</span><Plus className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-45' : ''}`} /></button>
             {isDropdownOpen && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar p-2">
                 <input type="text" placeholder="Search..." className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 mb-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                 {filteredCountries.map(country => <button key={country} onClick={() => toggleCountry(country)} className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center hover:bg-slate-800 ${selectedCountries.includes(country) ? 'text-cyan-400 font-medium' : 'text-slate-400'}`}>{country}</button>)}
               </div>
             )}
             <button onClick={handleGenerateBriefing} disabled={isGenerating || selectedCountries.length === 0} className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${isGenerating || selectedCountries.length === 0 ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20'}`}>{isGenerating ? <Cpu className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}Generate Research</button>
          </div>
        </div>

        <div className="glass-panel p-4 md:p-6 rounded-xl flex-1 flex flex-col min-h-[400px] z-10">
          <textarea className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm resize-none" placeholder="Research content or field reports..." value={reportText} onChange={(e) => setReportText(e.target.value)} />
          <div className="mt-4 flex justify-between items-center">
            <button onClick={() => setReportText('')} className="text-sm text-slate-500 hover:text-slate-300 p-2">Clear</button>
            <button onClick={handleAnalysis} disabled={isAnalyzing || !reportText} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${isAnalyzing ? 'bg-slate-700 text-slate-400' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}>{isAnalyzing ? <Cpu className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}Analyze & Save</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        {result ? (
          <div className="glass-panel p-4 md:p-6 rounded-xl flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 border-l-4 border-l-cyan-500 min-h-[500px]">
             <div className="flex justify-between items-start mb-6 gap-3">
                <div><h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /> Intelligence Summary</h3><p className="text-slate-400 text-sm mt-1">Harmonized & Saved to Library</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewMode(viewMode === 'standard' ? 'policymaker' : 'standard')} className="px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-white">{viewMode === 'standard' ? 'Visual View' : 'Text View'}</button>
                  <button onClick={() => setShowReportModal(true)} className="p-2 bg-slate-800 text-cyan-400 border border-slate-700 rounded-lg transition-colors"><FileText className="w-5 h-5" /></button>
                </div>
             </div>
             <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
               {viewMode === 'standard' ? (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 flex flex-col items-center"><Timer className="w-6 h-6 text-rose-400 mb-2" /><span className="text-xs text-slate-400 uppercase font-bold">Immediate</span><span className="text-base font-bold text-white">{result.timeline.immediate}</span></div>
                      <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 flex flex-col items-center"><Hourglass className="w-6 h-6 text-amber-400 mb-2" /><span className="text-xs text-slate-400 uppercase font-bold">Prep Window</span><span className="text-base font-bold text-white">{result.timeline.preparedness}</span></div>
                   </div>
                   <div><h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</h4><p className="text-slate-200 text-base leading-relaxed">{result.summary}</p></div>
                   <div className="bg-slate-800/40 p-5 rounded-lg border border-slate-700">
                     <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Reasoning</h4>
                     <ul className="space-y-2">{result.deductions?.map((d, i) => (<li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-slate-600">0{i+1}.</span> {d}</li>))}</ul>
                   </div>
                 </>
               ) : <PolicymakerVisuals data={result} />}
             </div>
          </div>
        ) : (
          <div className="glass-panel p-4 md:p-6 rounded-xl flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 min-h-[400px]">
             <BrainCircuit className="w-10 h-10 text-slate-600 mb-6" />
             <h3 className="text-slate-300 font-medium text-lg">Awaiting Intelligence</h3>
             <p className="text-slate-500">Run an analysis to see results and save them to your library.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTool;
