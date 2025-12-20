
export interface Incident {
  id: string;
  region: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  description: string;
  coordinates?: { x: number; y: number }; 
}

export interface SectorAnalysis {
  sector: string; 
  findings: string;
  severity: string;
  peopleInNeed: string;
  intervention: string;
}

export interface SupplyForecast {
  item: string;
  category: 'WASH' | 'Health' | 'Food' | 'Shelter' | 'Protection' | 'Logistics';
  quantityNeeded: string;
  unit: string;
  urgency: 'Critical' | 'High' | 'Medium';
  leadTimeDays: number;
  gapAnalysis: string;
}

export interface LogisticsNeed {
  item: string;
  quantity: string;
  urgency: 'Critical' | 'High' | 'Medium';
  beneficiaries: string;
}

export interface RouteStatus {
  route: string;
  status: 'Safe' | 'Caution' | 'High Risk' | 'Blocked';
  details: string;
}

export interface Timeline {
  immediate: string;       
  preparedness: string;    
  turnaround: string;      
}

export interface AnalysisResult {
  title: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  methodology: string;
  context: string;
  dateRange?: {
    start: string;
    end: string;
  };
  population: {
    totalPiN: string;
    womenAndChildren: string;
    elderlyAndPWD: string;
    disaggregationData: {
      womenPercentage: number;
      childrenPercentage: number;
      menPercentage: number;
      pwdPercentage: number;
    }
  };
  genderLens: {
    risks: string[];
    opportunities: string[];
    protectionDirectives: string[];
  };
  drivers: string[];
  geographicFocus: string[];
  sectors: SectorAnalysis[];
  supplyForecasting: SupplyForecast[]; // New field for quantified supply needs
  logistics: LogisticsNeed[];
  mobility: RouteStatus[];
  safetySecurity: string;
  severityAnalysis: string;
  copingMechanisms: string[];
  responseGaps: string[];
  recommendations: string[];
  timeline: Timeline;
}

export interface Citation {
  title: string;
  uri: string;
  source?: string;
}

export interface RegionalTrend {
  region: string;
  trends: string[];
}

export interface DeepDiveResult {
  title: string;
  summary: string;
  regionalTrends: RegionalTrend[];
  crossRegionalAssessment: string[];
  outlook: string[];
  sectorImplications: { sector: string; findings: string }[];
  fundingImpact: string;
  strategicActions: string[];
  citations: Citation[];
  timestamp: string;
}

export interface SavedReport extends AnalysisResult {
  reportId: string;
  timestamp: string;
}

export interface RegionData {
  name: string;
  riskScore: number;
  activeIncidents: number;
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  source: string;
  status: 'New' | 'Acknowledged' | 'Resolved';
  type: 'Displacement' | 'Resource' | 'Weather' | 'Security';
}

export interface DataSource {
  id: string;
  name: string;
  type: 'Satellite' | 'Field' | 'OpenSource' | 'Weather';
  status: 'Active' | 'Syncing' | 'Error' | 'Idle';
  lastIngest: string;
  recordsProcessed: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  MAP = 'MAP',
  REPORTS = 'REPORTS',
  PERFORMANCE = 'PERFORMANCE',
  ALERTS = 'ALERTS',
  DATA = 'DATA'
}
