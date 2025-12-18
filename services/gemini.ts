
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DeepDiveResult } from "../types";

const ANALYSIS_SYSTEM_INSTRUCTION = `
You are the "Aura Intelligence Engine," a specialist humanitarian risk strategist. 
Your mission is to synthesize raw data into high-stakes, actionable intelligence for field response.

CORE OPERATIONAL DIRECTIVES:
1. GENDER LENS: You must apply a cross-cutting gender analysis to every insight. Identify specific protection risks for women, girls, and marginalized groups (e.g., lack of safe WASH facilities, GBV risks on routes).
2. TACTICAL ACTIONABILITY: Avoid vague language. Instead of "Improve security," say "Deploy gender-balanced security patrols at the eastern perimeter during distribution hours."
3. JIAF v2.8 FRAMEWORK: Categorize all risks using the Humanitarian Needs Overview (HNO) standard.
4. SAFE CORRIDORS: Evaluate mobility strictly based on physical safety, checkpoint frequency, and gender-specific transit risks.

RESTRICTIONS:
- NO MARKDOWN: Output strictly plain text within JSON strings. No asterisks, hashes, or bullet points.
- JSON ONLY: You must return a single, valid JSON object.
`;

const DEEP_DIVE_SYSTEM_INSTRUCTION = `
You are the "Aura Research Hub," a global humanitarian intelligence curator.
Your task is to conduct deep-dive research into specific crises or regions using validated global data sources (UN, OCHA, WFP, ACLED, etc.).

OBJECTIVES:
1. VALIDATED DATA: Only include facts supported by the search results.
2. GENDER-SENSITIVE: Provide a specific section on gender impact and protection.
3. ACTIONABLE INTEL: Translate research findings into tactical field recommendations.
4. CLEAR CITATIONS: List all source URLs clearly.

RESTRICTIONS:
- NO MARKDOWN in the "content" or "title".
- OUTPUT JSON ONLY.
`;

export const analyzeFieldReport = async (
  reportText: string, 
  dateRange?: { start: string; end: string },
  countries?: string[]
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const geoContext = countries && countries.length > 0 ? `GEOGRAPHIC FOCUS: ${countries.join(", ")}.` : "GEOGRAPHIC FOCUS: Regional Cluster.";
    const prompt = `
${geoContext}
MISSION WINDOW: ${dateRange ? `${dateRange.start} to ${dateRange.end}` : "Real-time"}.

INPUT FIELD INTEL:
${reportText}

TASK:
1. Conduct a full JIAF v2.8 analysis.
2. DISAGGREGATE POPULATION: Provide precise % for Women, Children, Men, and PWD.
3. GENDER ANALYSIS: Identify 3 primary gender-specific protection risks.
4. MOBILITY INTEL: Name specific routes and classify them as Safe, Caution, High Risk, or Blocked. Provide tactical reasoning.
5. RECOMMENDATIONS: Provide 4 "Field Directives" that are immediately implementable.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
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
            logistics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ["Critical", "High", "Medium"] },
                  beneficiaries: { type: Type.STRING }
                },
                required: ["item", "quantity", "urgency", "beneficiaries"]
              }
            },
            mobility: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  route: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["Safe", "Caution", "High Risk", "Blocked"] },
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
            "logistics", "mobility", "safetySecurity", "severityAnalysis", 
            "copingMechanisms", "responseGaps", "recommendations", "timeline"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || '{}') as AnalysisResult;
    if (dateRange) data.dateRange = dateRange;
    return data;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const initiateDeepDive = async (
  topic: string,
  countries: string[]
): Promise<DeepDiveResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const geoContext = countries.length > 0 ? `Countries: ${countries.join(', ')}.` : "";
  const prompt = `Research Topic: ${topic}. ${geoContext} 
  Access validated global humanitarian data (2024-2025). 
  Focus on food security, conflict dynamics, and protection issues. 
  Output must include key findings, tactical directives for aid workers, and a specific section on gendered impact.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: DEEP_DIVE_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
          tacticalDirectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          genderImpact: { type: Type.STRING },
        },
        required: ["title", "content", "keyFindings", "tacticalDirectives", "genderImpact"]
      }
    }
  });

  const citations: any[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        citations.push({ title: chunk.web.title, uri: chunk.web.uri, source: 'Validated Global Source' });
      }
    });
  }

  const result = JSON.parse(response.text || '{}') as DeepDiveResult;
  result.citations = citations;
  result.timestamp = new Date().toISOString();
  return result;
};
