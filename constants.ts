
import { Incident, RegionData, Alert, DataSource } from "./types";

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
  },
  {
    id: '4',
    region: 'Ukraine',
    type: 'Infrastructure Strike',
    severity: 'High',
    date: '2025-12-07',
    description: 'Strikes on power/water infrastructure produced rolling outages in frontline communities.',
    coordinates: { x: 58, y: 25 }
  },
  {
    id: '5',
    region: 'Nigeria',
    type: 'Banditry',
    severity: 'Medium',
    date: '2025-12-06',
    description: 'Banditry insurgent hybrid attacks targeting transport routes.',
    coordinates: { x: 50, y: 50 }
  }
];

export const REGION_STATS: RegionData[] = [
  { name: 'Sudan', riskScore: 92, activeIncidents: 14, trend: 'increasing', lastUpdated: '10 min ago' },
  { name: 'Gaza', riskScore: 95, activeIncidents: 8, trend: 'stable', lastUpdated: '2 min ago' },
  { name: 'Eastern DRC', riskScore: 88, activeIncidents: 12, trend: 'increasing', lastUpdated: '1 hour ago' },
  { name: 'Ukraine', riskScore: 85, activeIncidents: 6, trend: 'increasing', lastUpdated: '3 hours ago' },
  { name: 'Nigeria', riskScore: 75, activeIncidents: 9, trend: 'stable', lastUpdated: '5 hours ago' },
  { name: 'Afghanistan', riskScore: 70, activeIncidents: 4, trend: 'decreasing', lastUpdated: '1 day ago' },
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

export const KPI_RESPONSE_DATA = [
  { name: 'Week 1', velocity: 12.5, target: 8 },
  { name: 'Week 2', velocity: 10.2, target: 8 },
  { name: 'Week 3', velocity: 8.4, target: 8 },
  { name: 'Week 4', velocity: 6.1, target: 8 },
];

export const KPI_COVERAGE_DATA = [
  { name: 'Food', value: 85, fill: '#00aaff' },
  { name: 'Water', value: 62, fill: '#3b82f6' },
  { name: 'Medical', value: 45, fill: '#ef4444' },
  { name: 'Shelter', value: 70, fill: '#eab308' },
];

export const TURNAROUND_DATA = [
  { name: 'Detection', time: 0.5, fill: '#06b6d4' }, // cyan-500
  { name: 'Validation', time: 1.2, fill: '#3b82f6' }, // blue-500
  { name: 'Analysis', time: 0.8, fill: '#6366f1' }, // indigo-500
  { name: 'Logistics', time: 2.5, fill: '#a855f7' }, // purple-500
  { name: 'Deployment', time: 4.0, fill: '#ec4899' }, // pink-500
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', title: 'Sudden Displacement', message: 'Movement of 5,000+ individuals detected North of Goma.', severity: 'Critical', timestamp: '2m ago', source: 'Satellite / Field', status: 'New', type: 'Displacement' },
  { id: 'a2', title: 'Flash Flood Warning', message: 'Heavy rains predicted in Beira corridor next 12h.', severity: 'High', timestamp: '15m ago', source: 'Weather API', status: 'New', type: 'Weather' },
  { id: 'a3', title: 'Supply Convoy Delayed', message: 'Route 4 blockade causing estimated 6h delay.', severity: 'Medium', timestamp: '1h ago', source: 'GPS Tracking', status: 'Acknowledged', type: 'Resource' },
  { id: 'a4', title: 'Cholera Outbreak Risk', message: 'Water contamination markers elevated in Zone B.', severity: 'High', timestamp: '3h ago', source: 'Health Reports', status: 'Resolved', type: 'Resource' },
];

export const DATA_SOURCES: DataSource[] = [
  { id: 'ds1', name: 'OCHA ReliefWeb API', type: 'OpenSource', status: 'Active', lastIngest: '2m ago', recordsProcessed: 1540 },
  { id: 'ds2', name: 'UNHCR Data Portal', type: 'OpenSource', status: 'Active', lastIngest: '5m ago', recordsProcessed: 890 },
  { id: 'ds3', name: 'UNICEF Field Reports', type: 'Field', status: 'Syncing', lastIngest: '1m ago', recordsProcessed: 320 },
  { id: 'ds4', name: 'Twilio SMS Gateway', type: 'Field', status: 'Active', lastIngest: 'Just now', recordsProcessed: 56 },
];

export const PRIORITY_ACTIONS = [
  { id: '1', action: 'Front-load flexible funding for trauma care, water trucking, essential medicines, and winterisation.', urgency: 'High' },
  { id: '2', action: 'Advocate for and secure predictable corridor agreements across Gaza, Darfur, and Eastern DRC.', urgency: 'Critical' },
  { id: '3', action: 'Deploy mobile trauma and surgical teams to high-need hubs (El Fasher–Tawila, Beni–Lubero).', urgency: 'Critical' },
  { id: '4', action: 'Scale protection staffing, with emphasis on GBV, child protection, and MHPSS.', urgency: 'High' },
  { id: '5', action: 'Pre-position NFI, food, and WASH supplies close to response hubs where access may open briefly.', urgency: 'Medium' },
  { id: '6', action: 'Strengthen winterisation pipelines for Ukraine and Afghanistan.', urgency: 'High' },
  { id: '7', action: 'Support community-based protection networks and early-warning capacities in Nigeria, Sudan, and DRC.', urgency: 'Medium' },
  { id: '8', action: 'Prioritize fuel allocation for hospitals, water systems, and cold-chain facilities.', urgency: 'Critical' },
];

export const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia", "Australia", "Azerbaijan",
  "Bangladesh", "Belarus", "Belgium", "Benin", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Croatia", "Cuba",
  "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Eritrea", "Ethiopia",
  "France",
  "Gaza (OPT)", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea",
  "Haiti", "Honduras",
  "India", "Indonesia", "Iran", "Iraq", "Israel", "Italy", "Ivory Coast",
  "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kyrgyzstan",
  "Laos", "Lebanon", "Liberia", "Libya",
  "Madagascar", "Malawi", "Malaysia", "Mali", "Mauritania", "Mexico", "Moldova", "Mongolia", "Morocco", "Mozambique", "Myanmar",
  "Nepal", "Netherlands", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tunisia", "Turkey", "Turkmenistan",
  "Uganda", "Ukraine", "United Kingdom", "United States", "Uzbekistan",
  "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];
