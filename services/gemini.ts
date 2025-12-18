
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an advanced Humanitarian Intelligence Engine (Aura). 
Your goal is to harmonize disparate data points into actionable intelligence for policymakers and field actors.

OBJECTIVES:
1. KEEP HUMANITARIANS SAFE: Identify threats to worker safety and safe mobility routes.
2. QUANTIFY AID: Estimate specific supply amounts needed.
3. TURNAROUND: Estimate time for response vs. preparedness.
4. VULNERABILITY: Prioritize children, women, and PWDs.

Output must be structured JSON.
`;

export const analyzeFieldReport = async (reportText: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex reasoning tasks
      model: "gemini-3-pro-preview",
      contents: reportText,
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            keyEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedResponse: { type: Type.STRING },
            deductions: { type: Type.ARRAY, items: { type: Type.STRING } },
            scenarios: {
              type: Type.OBJECT,
              properties: {
                bestCase: { type: Type.STRING },
                mostLikely: { type: Type.STRING },
                worstCase: { type: Type.STRING }
              },
              required: ["bestCase", "mostLikely", "worstCase"]
            },
            sectoralAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING },
                  identifiedRisk: { type: Type.STRING },
                  recommendedIntervention: { type: Type.STRING }
                },
                required: ["sector", "identifiedRisk", "recommendedIntervention"]
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
            timeline: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.STRING },
                preparedness: { type: Type.STRING },
                turnaround: { type: Type.STRING }
              },
              required: ["immediate", "preparedness", "turnaround"]
            },
            vulnerableGroups: {
              type: Type.OBJECT,
              properties: {
                womenAndChildren: { type: Type.STRING },
                peopleWithDisabilities: { type: Type.STRING },
                genderDisparities: { type: Type.STRING },
                specificNeeds: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["womenAndChildren", "peopleWithDisabilities", "genderDisparities", "specificNeeds"]
            }
          },
          required: ["title", "summary", "riskLevel", "keyEntities", "actionableInsights", "suggestedResponse", "deductions", "scenarios", "sectoralAnalysis", "logistics", "mobility", "timeline", "vulnerableGroups"]
        }
      }
    });

    // Directly accessing .text property as per guidelines
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateRiskBriefing = async (
  countries: string[], 
  dateRange?: { start: string; end: string }
): Promise<{ text: string, citations: { title: string, uri: string }[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Deep research briefing for: ${countries.join(', ')}. Focus on dates: ${dateRange?.start} to ${dateRange?.end}.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const citations: { title: string, uri: string }[] = [];
  response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
    if (chunk.web) citations.push({ title: chunk.web.title || "Source", uri: chunk.web.uri });
  });

  return { 
    // Directly accessing .text property as per guidelines
    text: response.text || "Briefing unavailable.", 
    citations: Array.from(new Map(citations.map(item => [item.uri, item])).values())
  };
};
