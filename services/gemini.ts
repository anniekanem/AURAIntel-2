
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Enhanced System Instruction for "Deep Research" behavior with Sectoral focus
const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an advanced Humanitarian Intelligence Engine (Aura). 
Your goal is to harmonize disparate data points into actionable intelligence for policymakers and field actors.

OBJECTIVES:
1. KEEP HUMANITARIANS SAFE: Identify threats to worker safety and safe mobility routes.
2. QUANTIFY AID: Estimate specific supply amounts needed to ensure timely delivery.
3. GAUGE TURNAROUND TIME: Estimate the time required for immediate response vs. preparedness lead time.
4. PRIORITIZE VULNERABLE GROUPS: Specifically analyze and prioritize incidents involving children, women, and people with disabilities.
5. GENDER DISPARITY: Identify and report on gender disparities in access to aid, safety, or reporting metrics.

METHODOLOGY:
1. HARMONIZE: Cross-reference the provided field report with general knowledge.
2. DEDUCE: Use deductive reasoning (e.g., "Heavy rains" + "Displaced people" = "High risk of waterborne disease").
3. PREDICT: Generate distinct scenarios (Best, Likely, Worst).
4. SECTORAL INTERVENTION: Categorize recommendations into standard Humanitarian Sectors (Health, Nutrition, WASH, Shelter & NFI, Food Security, Education, Protection, Early Recovery, ETC, Logistics).
5. LOGISTICS & QUANTIFICATION: You MUST estimate specific quantities based on the text (e.g., if 1000 people are displaced, estimate "200 Tents", "15 MT Food").
6. MOBILITY & ACCESS: Identify specific routes or corridors and assess their safety status (Safe, Caution, Blocked).
7. TIMELINE & TURNAROUND: Gauge the time sensitivity. Provide 'immediate' (deadline for urgent action), 'preparedness' (lead time for setup), and 'turnaround' (estimated total time to effective response).
8. VULNERABILITY & GENDER: Explicitly extract details on risks to women, children, and PWDs, and note any gender-based discrepancies.
9. IMPACT-BASED NEEDS: Explicitly list specific interventions/products needed for vulnerable groups based on the impact (e.g., "Dignity Kits for 500 women", "Child-Friendly Space kits").

Output must be structured JSON.
`;

export const analyzeFieldReport = async (reportText: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: reportText,
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A formal, professional title for the Situation Report (e.g., 'Situation Analysis: Escalation in North Kivu')" },
            summary: { type: Type.STRING, description: "Executive summary focusing on 'So What?'" },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            keyEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General strategic bullet points" },
            suggestedResponse: { type: Type.STRING },
            deductions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Logical steps taken to reach conclusions." 
            },
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
              description: "Specific interventions mapped to humanitarian sectors",
              items: {
                type: Type.OBJECT,
                properties: {
                  sector: { type: Type.STRING, description: "Must match one of the standard Humanitarian Sectors." },
                  identifiedRisk: { type: Type.STRING },
                  recommendedIntervention: { type: Type.STRING }
                },
                required: ["sector", "identifiedRisk", "recommendedIntervention"]
              }
            },
            logistics: {
              type: Type.ARRAY,
              description: "Quantified supply needs",
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING, description: "e.g. Tents, Rice, IV Fluids" },
                  quantity: { type: Type.STRING, description: "Estimated amount e.g. '500 kits', '10 MT'" },
                  urgency: { type: Type.STRING, enum: ["Critical", "High", "Medium"] },
                  beneficiaries: { type: Type.STRING, description: "Target population count" }
                },
                required: ["item", "quantity", "urgency", "beneficiaries"]
              }
            },
            mobility: {
              type: Type.ARRAY,
              description: "Route safety assessments",
              items: {
                type: Type.OBJECT,
                properties: {
                  route: { type: Type.STRING, description: "Name of road or corridor" },
                  status: { type: Type.STRING, enum: ["Safe", "Caution", "High Risk", "Blocked"] },
                  details: { type: Type.STRING, description: "Why is it safe or blocked?" }
                },
                required: ["route", "status", "details"]
              }
            },
            timeline: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.STRING, description: "Urgent action deadline (e.g. 'Within 6 hours')" },
                preparedness: { type: Type.STRING, description: "Lead time for preparedness (e.g. '2-3 days for supply')" },
                turnaround: { type: Type.STRING, description: "Total estimated turnaround for full response (e.g. '48 hours')" }
              },
              required: ["immediate", "preparedness", "turnaround"]
            },
            vulnerableGroups: {
              type: Type.OBJECT,
              properties: {
                womenAndChildren: { type: Type.STRING, description: "Specific risks or incidents involving women and children." },
                peopleWithDisabilities: { type: Type.STRING, description: "Specific risks or accessibility issues for PWD." },
                genderDisparities: { type: Type.STRING, description: "Observed disparities in reporting, access, or impact based on gender." },
                specificNeeds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific products/interventions needed for these groups (e.g. '500 Dignity Kits')." }
              },
              required: ["womenAndChildren", "peopleWithDisabilities", "genderDisparities", "specificNeeds"]
            }
          },
          required: ["title", "summary", "riskLevel", "keyEntities", "actionableInsights", "suggestedResponse", "deductions", "scenarios", "sectoralAnalysis", "logistics", "mobility", "timeline", "vulnerableGroups"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      title: "Incident Analysis Report",
      summary: "System unable to process report at this time. Please check connection.",
      riskLevel: "Medium",
      keyEntities: ["Unknown"],
      actionableInsights: ["Manual review required."],
      suggestedResponse: "Proceed with caution.",
      deductions: ["Analysis service unavailable."],
      scenarios: {
        bestCase: "N/A",
        mostLikely: "N/A",
        worstCase: "N/A"
      },
      sectoralAnalysis: [],
      logistics: [],
      mobility: [],
      timeline: {
        immediate: "N/A",
        preparedness: "N/A",
        turnaround: "N/A"
      },
      vulnerableGroups: {
        womenAndChildren: "Data unavailable",
        peopleWithDisabilities: "Data unavailable",
        genderDisparities: "Data unavailable",
        specificNeeds: []
      }
    };
  }
};

// Now uses Google Search to perform "Deep Dive Research" with optional Date Range
export const generateRiskBriefing = async (
  countries: string[], 
  dateRange?: { start: string; end: string }
): Promise<{ text: string, citations: { title: string, uri: string }[] }> => {
  try {
    if (countries.length === 0) return { text: "", citations: [] };
    
    let dateContext = "recent news and validated reports";
    let datePrompt = "What happened in the last 72 hours?";
    
    if (dateRange && dateRange.start && dateRange.end) {
      dateContext = `events specifically between ${dateRange.start} and ${dateRange.end}`;
      datePrompt = `INCIDENT TRENDS (${dateRange.start} to ${dateRange.end}): What key events occurred during this specific window?`;
    }

    // We use the search tool to get real-time ground truth
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Conduct a deep-dive research briefing for: ${countries.join(', ')}.
      
      Focus harmonization of data on ${dateContext}.
      Prioritize and specifically cite reports from: OCHA, UNHCR, UNICEF, UN verified sources, and SMS field reports if available online.
      
      Provide:
      1. ${datePrompt}
      2. CROSS-BORDER IMPACTS: How did events in these regions affect each other?
      3. CRITICAL FORECAST: What is the outlook following this period?
      4. VULNERABLE POPULATIONS: Detail impact on women, children, and PWDs (Source: UNICEF/UNHCR).
      5. GENDER DYNAMICS: Note any disparities in reporting or impact.
      6. SECTORAL OVERVIEW: Briefly highlight critical needs in Health, WASH, Nutrition, and Protection (Source: OCHA/Clusters).
      7. MOBILITY CHECK: Identify open and blocked transport corridors.

      Format as a professional intelligence briefing.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    // Extract citations from grounding metadata (Perplexity-style)
    const citations: { title: string, uri: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          citations.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri
          });
        }
      });
    }

    // Deduplicate citations based on URI
    const uniqueCitations = Array.from(new Map(citations.map(item => [item.uri, item])).values());

    return { 
      text: response.text || "Unable to generate briefing.",
      citations: uniqueCitations
    };

  } catch (error) {
    console.error("Briefing generation failed:", error);
    return { 
      text: `Error generating briefing for ${countries.join(', ')}. Please try again.`, 
      citations: [] 
    };
  }
};
