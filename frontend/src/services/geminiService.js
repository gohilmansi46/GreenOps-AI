import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const generateGovernanceInsights = async (governanceData) => {
  try {
    const prompt = `
You are an ESG Governance Intelligence Assistant.

Analyze the following governance information from an organization's ESG management platform.

Governance Data:
${JSON.stringify(governanceData, null, 2)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "A concise management-level governance summary.",
  "riskLevel": "Critical | High | Medium | Low",
  "criticalRisks": [
    "Risk identified from the provided data"
  ],
  "complianceGaps": [
    "Compliance gap identified from the provided data"
  ],
  "policyPriorities": [
    "Policy priority identified from the provided data"
  ],
  "auditObservations": [
    "Audit observation identified from the provided data"
  ],
  "recommendedActions": [
    {
      "action": "Recommended action",
      "priority": "Critical | High | Medium | Low",
      "reason": "Why this action is recommended"
    }
  ]
}

Rules:
- Use only the governance information provided.
- Do not invent facts, numbers, policies, risks or audit findings.
- If there is not enough information for a section, return an empty array.
- Keep recommendations practical for an ESG manager.
- Return ONLY JSON. Do not use markdown.

Focus only on the information provided.
Do not invent specific facts or numbers that are not present in the data.

Keep the response professional, practical and easy for an ESG manager to understand.
`;

   const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

const text = response.text;

const cleanedText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanedText);

  } catch (error) {
    console.error("Gemini governance analysis error:", error);
    throw new Error("Unable to generate governance insights.");
  }
};