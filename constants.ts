
import { Incident, RegionData, Alert, DataSource } from "./types";

export const HUMANITARIAN_CONTEXT_DEC_2025 = `
REGIONAL RISK BRIEFING: 3–10 DECEMBER 2025
GEOGRAPHIC COVERAGE: Nigeria, Eastern DRC, Sudan, South Sudan, Gaza, Ukraine, Syria, Afghanistan

KEY VERIFIED INCIDENT TRENDS:
- Sudan (North Darfur): Fighting around El Fasher continued with strikes on health/WASH sites. Severe fuel shortages and high latrine-to-user ratios in shelters.
- Eastern DRC: Armed-group attacks in Lubero/Mambasa. Access disruptions along Beni-Butembo corridor affecting food/NFI dispatch.
- Nigeria: Banditry/insurgent attacks in NW & NE (Borno, Kaduna, etc.). Flooding in mining zones causing secondary displacement.
- South Sudan: Intercommunal clashes and cattle-raiding in Upper Nile/Jonglei disrupting markets. Riverine routes blocked.
- Gaza: Crossings inconsistent; fuel shortages reducing hospital functionality; overcrowding in shelters raising disease risks.
- Ukraine: Strikes on power/water infrastructure causing outages. High winterization needs.
- Syria: Degraded water networks and UXO contamination complicating access to services.
- Afghanistan: High returnee flows at border points; communication disruptions; restrictions on female staff affecting aid delivery.

CROSS-REGIONAL TREND ASSESSMENT:
1. Operational access remains the top constraint.
2. Hybrid threats expanding geographically (militant + criminal tactics).
3. Service degradation creates cascading effects (power failure -> malnutrition).
4. Shelter density and public health risks are rising.
5. Funding timing matters; agencies face cuts to trauma care and winterization.

7-14 DAY OUTLOOK:
- High probability of attacks in E-DRC and NW Nigeria.
- Gaza convoy flow inconsistent.
- Severe winter in Ukraine/Afghanistan.
- Continued strain on medical systems in Darfur/Gaza.
- Public health risks in high-density settlements.

PRIORITY ACTIONS (TOP 8):
1. Front-load flexible funding (trauma, WASH, winterization).
2. Advocate for predictable corridors (Gaza, Darfur, DRC).
3. Deploy mobile trauma/surgical teams.
4. Scale protection staffing (GBV, Child Protection).
5. Pre-position NFIs/Food close to hubs.
6. Strengthen winterization pipelines (Ukraine, Afghanistan).
7. Support community-based protection networks.
8. Prioritize fuel for hospitals and water systems.
`;

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    region: 'Sudan (North Darfur)',
    type: 'Conflict',
    severity: 'Critical',
    date: '2025-12-08',
    description: 'Fighting around El Fasher continued with repeated strikes on health and WASH sites.',
    coordinates: { x: 65, y: 40 }
  },
  {
    id: '2',
    region: 'Eastern DRC',
    type: 'Ambush',
    severity: 'High',
    date: '2025-12-09',
    description: 'Armed-group attacks in rural Lubero generated new casualties and displacement.',
    coordinates: { x: 60, y: 60 }
  },
  {
    id: '3',
    region: 'Gaza',
    type: 'Access Restriction',
    severity: 'Critical',
    date: '2025-12-10',
    description: 'Fuel shortages reducing hospital functionality. Crossings inconsistent.',
    coordinates: { x: 55, y: 35 }
  }
];

export const STRATEGIC_KPI_TARGETS = [
  { label: 'Security Incidents', current: -12.4, target: -15.0, suffix: '%', desc: 'Reduction in field incidents' },
  { label: 'Assessment Time', current: -38.2, target: -40.0, suffix: '%', desc: 'Automation of JIAF framework' },
  { label: 'Aid Delivery', current: 18.5, target: 20.0, suffix: '%', desc: 'Logistics path optimization' }
];

export const REGION_STATS: RegionData[] = [
  { name: 'Sudan', riskScore: 92, activeIncidents: 14, trend: 'increasing', lastUpdated: '10 min ago' },
  { name: 'Gaza', riskScore: 95, activeIncidents: 8, trend: 'stable', lastUpdated: '2 min ago' },
  { name: 'Eastern DRC', riskScore: 88, activeIncidents: 12, trend: 'increasing', lastUpdated: '1 hour ago' },
  { name: 'Ukraine', riskScore: 85, activeIncidents: 6, trend: 'increasing', lastUpdated: '3 hours ago' },
];

export const IMPACT_STATS = {
  totalAffected: '2.4M',
  populationReached: '1.1M',
  coverage: 46,
  casualties: '3,420',
  injured: '12,500',
  displaced: '850,000'
};

export const MOCK_CHART_DATA = [
  { name: 'Mon', incidents: 4, severity: 2 },
  { name: 'Tue', incidents: 3, severity: 3 },
  { name: 'Wed', incidents: 7, severity: 4 },
  { name: 'Thu', incidents: 5, severity: 3 },
  { name: 'Fri', incidents: 8, severity: 5 },
  { name: 'Sat', incidents: 6, severity: 4 },
  { name: 'Sun', incidents: 9, severity: 5 },
];

export const DATA_SOURCES: DataSource[] = [
  { id: 'ds1', name: 'OCHA ReliefWeb API', type: 'OpenSource', status: 'Active', lastIngest: '2m ago', recordsProcessed: 1540 },
  { id: 'ds2', name: 'Sentinel Hub (Satellite)', type: 'Satellite', status: 'Active', lastIngest: '5m ago', recordsProcessed: 420 },
  { id: 'ds3', name: 'KoBoToolbox Forms', type: 'Field', status: 'Syncing', lastIngest: '1m ago', recordsProcessed: 320 },
  { id: 'ds4', name: 'Ushahidi Data Stream', type: 'Field', status: 'Active', lastIngest: 'Just now', recordsProcessed: 89 },
  { id: 'ds5', name: 'Google Earth Engine', type: 'Satellite', status: 'Active', lastIngest: '12m ago', recordsProcessed: 2100 },
];

export const PRIORITY_ACTIONS = [
  { id: '1', action: 'Front-load flexible funding for trauma care and winterisation.', urgency: 'High' },
  { id: '2', action: 'Secure predictable corridor agreements across Gaza and Darfur.', urgency: 'Critical' },
  { id: '3', action: 'Deploy mobile trauma teams to high-need hubs.', urgency: 'Critical' },
];

export const ALL_COUNTRIES = [
  "Afghanistan", "Angola", "Burkina Faso", "Burundi", "Central African Republic", "Chad", "Congo (DRC)", "Ethiopia",
  "Gaza (OPT)", "Haiti", "Iraq", "Mali", "Myanmar", "Nigeria", "Somalia", "South Sudan", "Sudan", "Syria", "Ukraine", "Yemen"
];

export const KPI_RESPONSE_DATA = [
  { name: 'Jan', velocity: 12, target: 8 },
  { name: 'Feb', velocity: 10, target: 8 },
  { name: 'Mar', velocity: 9, target: 8 },
  { name: 'Apr', velocity: 7, target: 8 },
  { name: 'May', velocity: 6.1, target: 8 },
];

export const KPI_COVERAGE_DATA = [
  { name: 'Health', value: 85, fill: '#ef4444' },
  { name: 'WASH', value: 72, fill: '#3b82f6' },
  { name: 'Food', value: 92, fill: '#10b981' },
  { name: 'Protection', value: 64, fill: '#a855f7' },
  { name: 'Shelter', value: 58, fill: '#f59e0b' },
];

export const TURNAROUND_DATA = [
  { name: 'Ingestion', time: 1.2, fill: '#0ea5e9' },
  { name: 'Validation', time: 0.8, fill: '#3b82f6' },
  { name: 'Analysis', time: 2.5, fill: '#6366f1' },
  { name: 'Review', time: 1.6, fill: '#8b5cf6' },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Mass Displacement Trigger',
    message: 'Rapid movement of 2,500 individuals detected south of El Fasher following infrastructure strike.',
    severity: 'Critical',
    timestamp: '15m ago',
    source: 'Sentinel-2 / Satellite',
    status: 'New',
    type: 'Displacement'
  },
  {
    id: 'a2',
    title: 'Fuel Critical Level',
    message: 'Nasser Hospital reporting less than 12 hours of generator fuel remaining.',
    severity: 'Critical',
    timestamp: '42m ago',
    source: 'Field Intelligence',
    status: 'Acknowledged',
    type: 'Resource'
  },
  {
    id: 'a3',
    title: 'Supply Corridor Blocked',
    message: 'Heavy rainfall and mudslides have blocked the primary supply route between Goma and Lubero.',
    severity: 'High',
    timestamp: '2h ago',
    source: 'Weather Services',
    status: 'New',
    type: 'Weather'
  },
  {
    id: 'a4',
    title: 'Security Breach Reported',
    message: 'Unauthorized armed presence detected near the humanitarian hub in Bentiu.',
    severity: 'High',
    timestamp: '3h ago',
    source: 'Field Security Office',
    status: 'Resolved',
    type: 'Security'
  }
];
