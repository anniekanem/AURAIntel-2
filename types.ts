
export interface Incident {
  id: string;
  region: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  description: string;
  coordinates?: { x: number; y: number }; // Relative for abstract map
}

export interface SectorAnalysis {
  sector: string; // e.g., "WASH", "Health", "Protection"
  identifiedRisk: string;
  recommendedIntervention: string;
}

export interface LogisticsNeed {
  item: string;
  quantity: string;
  urgency: 'Critical' | 'High' | 'Medium';
  beneficiaries: string; // e.g. "5000 households"
}

export interface RouteStatus {
  route: string;
  status: 'Safe' | 'Caution' | 'High Risk' | 'Blocked';
  details: string;
}

export interface Timeline {
  immediate: string;       // e.g. "Within 6 hours"
  preparedness: string;    // e.g. "3-5 days lead time"
  turnaround: string;      // e.g. "48 hours full cycle"
}

export interface VulnerableGroupsAnalysis {
  womenAndChildren: string;
  peopleWithDisabilities: string;
  genderDisparities: string;
  specificNeeds: string[]; // Quantified needs specifically for these groups
}

export interface AnalysisResult {
  title: string; // New field for Report Title
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  keyEntities: string[];
  actionableInsights: string[]; // Kept for backward compatibility/general summary
  suggestedResponse: string;
  // New Deep Dive Fields
  deductions: string[]; // Logic steps: "Because X and Y, then Z"
  scenarios: {
    bestCase: string;
    mostLikely: string;
    worstCase: string;
  };
  sectoralAnalysis: SectorAnalysis[]; // New structured interventions
  // New Fields for Logistics & Mobility
  logistics: LogisticsNeed[];
  mobility: RouteStatus[];
  timeline: Timeline; // New field for Time Estimation
  vulnerableGroups?: VulnerableGroupsAnalysis; // New field for Vulnerability Analysis
  citations?: { title: string; uri: string }[]; // For web-grounded results
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
