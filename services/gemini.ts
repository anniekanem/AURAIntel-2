
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DeepDiveResult, Citation } from "../types";

const MISSION_SYSTEM_INSTRUCTION = `
You are the "Aura Predictive Analytics Engine." 
Your objective is to generate real-time humanitarian intelligence reports by synthesizing validated field documents and global telemetry.

OPERATIONAL PRINCIPLES:
1. TEMPORAL GROUNDING: Strictly adhere to the selected date window.
2. GEOGRAPHIC SPECIFICITY: Only analyze the selected nodes.
3. JIAF v2.8 COMPLIANCE: Use Joint Intersectoral Analysis Framework terminology (PiN, Severity, etc.).
4. QUANTIFIED SUPPLY FORECAST: Provide specific items and estimated quantities needed (e.g., fuel in liters, trauma kits in units).

5. MANDATORY PROTECTION & GENDER LENS (PRIORITY):
   - You MUST prioritize analysis for women, children, and people with disabilities (PWD).
   - Report specific risks: GBV, child malnutrition, lack of disability-accessible WASH.
   - PROTECTION DIRECTIVES: Provide at least 3 high-priority actions specifically for these vulnerable groups.
   - DATA DISAGGREGATION: Ensure disaggregationData includes realistic percentages for Women, Children, and PWD based on the specific conflict context (e.g., higher child % in certain IDP settings).

Output strictly structured JSON. Do not use Markdown.
`;

const DEEP_DIVE_SYSTEM_INSTRUCTION = `
You are the "Aura Deep Intelligence Architect." 
Perform strategic, long-form trajectory assessments of humanitarian crises.

FOCUS:
- Infrastructure degradation and its specific impact on vulnerable groups.
- Cross-regional ripple effects.
- 6-month strategic trajectory for Women, Children, and PWD.

Output strictly structured JSON. Do not use Markdown.
`;

export const alignReferenceContext = async (
  rawContext: string,
  countries: string[],
  startDate: string,
  endDate: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
TASK: Align the following humanitarian briefing with the current mission parameters.
SELECTED NODES: ${countries.join(", ")}
TEMPORAL WINDOW: ${startDate} to ${endDate}

RAW BRIEFING:
${rawContext}

INSTRUCTION: 
1. Extract ONLY the segments relevant to the selected countries.
2. Prune out-of-cycle information not relevant to the ${startDate}-${endDate} window.
3. Organize the output clearly by country.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a context-alignment specialist. Filter and synthesize humanitarian data with zero hallucination.",
        temperature: 0.1,
      }
    });
    return response.text || rawContext;
  } catch (error) {
    console.error("Context alignment failed:", error);
    return rawContext;
  }
};

export const fetchRealtimeGrounding = async (
  countries: string[],
  startDate: string,
  endDate: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
TASK: Generate a validated humanitarian reference context for the following parameters.
SELECTED NODES: ${countries.join(", ")}
TEMPORAL WINDOW: ${startDate} to ${endDate}

Use Google Search to find recent OCHA SITREPs, ReliefWeb briefings, and verified field incidents. 
Search specifically for impacts on Women, Children, and Persons with Disabilities (PWD) in these regions.

STRUCTURE:
1. REGIONAL BRIEFING
2. KEY VERIFIED INCIDENT TRENDS
3. VULNERABILITY SNAPSHOT (Women, Children, PWD)
4. SECTORAL SNAPSHOTS
5. 7-14 DAY OUTLOOK
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an Intelligence Grounding Specialist. Use Google Search to provide accurate, real-time humanitarian briefings. Format as clean, readable text.",
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || "Failed to fetch real-time grounding.";
  } catch (error) {
    console.error("Real-time grounding fetch failed:", error);
    throw error;
  }
};

export const generateGlobalIntel = async (
  topic: string,
  countries: string[],
  uploadedContext?: string,
  dateRange?: { start: string; end: string }
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
MISSION: Tactical Intelligence Synthesis for ${topic || "Crisis Analysis"}.
TARGET NODES: ${countries.join(", ")}.
WINDOW: ${dateRange ? `${dateRange.start} to ${dateRange.end}` : "Current Cycle"}.
REFERENCE DATA: ${uploadedContext}

TASK:
1. Extract specific incidents and trends for the target nodes.
2. Forecast sectoral impacts.
3. Quantify immediate supply needs for the next 30 days.
4. PROVIDE A COMPREHENSIVE GENDER AND PROTECTION LENS: Detail the specific plight of women, children, and PWD.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: MISSION_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 15000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            methodology: { type: Type.STRING },
            context: { type: Type.STRING },
            population: {
              type: Type.OBJECT,
              properties: {
                totalPiN: { type: Type.STRING },
                womenAndChildren: { type: Type.STRING },
                elderlyAndPWD: { type: Type.STRING },
                disaggregationData: {
                  type: Type.OBJECT,
                  properties: {
                    womenPercentage: { type: Type.NUMBER },
                    childrenPercentage: { type: Type.NUMBER },
                    menPercentage: { type: Type.NUMBER },
                    pwdPercentage: { type: Type.NUMBER }
                  },
                  required: ["womenPercentage", "childrenPercentage", "menPercentage", "pwdPercentage"]
                }
              },
              required: ["totalPiN", "womenAndChildren", "elderlyAndPWD", "disaggregationData"]
            },
            genderLens: {
              type: Type.OBJECT,
              properties: {
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                protectionDirectives: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["risks", "opportunities", "protectionDirectives"]
            },
            drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
            geographicFocus: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  findings: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  peopleInNeed: { type: Type.STRING },
                  intervention: { type: Type.STRING }
                },
                required: ["sector", "findings", "severity", "peopleInNeed", "intervention"]
              }
            },
            supplyForecasting: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantityNeeded: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                  leadTimeDays: { type: Type.NUMBER },
                  gapAnalysis: { type: Type.STRING }
                },
                required: ["item", "category", "quantityNeeded", "unit", "urgency", "leadTimeDays", "gapAnalysis"]
              }
            },
            mobility: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  route: { type: Type.STRING },
                  status: { type: Type.STRING },
                  details: { type: Type.STRING }
                },
                required: ["route", "status", "details"]
              }
            },
            safetySecurity: { type: Type.STRING },
            severityAnalysis: { type: Type.STRING },
            copingMechanisms: { type: Type.ARRAY, items: { type: Type.STRING } },
            responseGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeline: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.STRING },
                preparedness: { type: Type.STRING },
                turnaround: { type: Type.STRING }
              },
              required: ["immediate", "preparedness", "turnaround"]
            }
          },
          required: [
            "title", "summary", "riskLevel", "methodology", "context", 
            "population", "genderLens", "drivers", "geographicFocus", "sectors", 
            "supplyForecasting", "mobility", "safetySecurity", 
            "severityAnalysis", "copingMechanisms", "responseGaps", 
            "recommendations", "timeline"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || '{}') as AnalysisResult;
    
    const citations: Citation[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          citations.push({ title: chunk.web.title, uri: chunk.web.uri, source: 'Aura Grounded Data' });
        }
      });
    }
    
    (data as any).citations = citations;
    return data;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateDeepDive = async (
  topic: string,
  countries: string[],
  uploadedContext?: string
): Promise<DeepDiveResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
MISSION: Strategic Trajectory Assessment for ${topic}.
TARGET AREAS: ${countries.join(", ")}.
CONTEXT: ${uploadedContext}

TASK:
1. Analyze how service failures specifically impact women, children, and PWD over the next 6 months.
2. Forecast cross-regional stability impacts.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: DEEP_DIVE_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 20000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            regionalTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  region: { type: Type.STRING },
                  trends: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["region", "trends"]
              }
            },
            crossRegionalAssessment: { type: Type.ARRAY, items: { type: Type.STRING } },
            outlook: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectorImplications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  findings: { type: Type.STRING }
                },
                required: ["sector", "findings"]
              }
            },
            fundingImpact: { type: Type.STRING },
            strategicActions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "regionalTrends", "crossRegionalAssessment", "outlook", "sectorImplications", "fundingImpact", "strategicActions"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}') as DeepDiveResult;
    
    const citations: Citation[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          citations.push({ title: chunk.web.title, uri: chunk.web.uri, source: 'Aura Strategic Insight' });
        }
      });
    }
    
    data.citations = citations;
    data.timestamp = new Date().toISOString();
    return data;
  } catch (error) {
    console.error("Deep Dive failed:", error);
    throw error;
  }
};
