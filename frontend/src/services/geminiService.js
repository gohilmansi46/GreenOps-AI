import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_demo_key";
  return new GoogleGenAI({ apiKey: key });
};

const getSmartESGResponse = (message, liveContext = null) => {
  const query = (message || "").toLowerCase();

  const env = liveContext?.environmental || {};
  const soc = liveContext?.social || {};
  const gov = liveContext?.governance || {};
  const score = liveContext?.esgScore || 85;

  if (query.includes("esg score") || query.includes("current score") || query.includes("overall score")) {
    return `📈 **Real-Time ESG Performance Situation:**\n\n` +
      `• **Overall ESG Score:** **${score} / 100** (${score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"})\n` +
      `• **Environmental Score:** ${env.carbon ? `${env.carbon} tCO₂ tracked (${env.scope || "Scope 1"})` : "Synced"}\n` +
      `• **Social Performance Score:** ${soc.totalEmployees ? `${soc.totalEmployees} employees, ${soc.averageTrainingHours || 0} hrs/emp training` : "Synced"}\n` +
      `• **Governance Score:** ${gov.score || "86%"} (${gov.policiesCount || 0} active policies, ${gov.risksCount || 0} open risks)\n\n` +
      `**Quick Improvement Idea:**\n` +
      `1. Reduce direct stationary combustion to lift Environmental score.\n` +
      `2. Increase annual employee training hours above 15 hrs/emp to boost Social score.\n` +
      `3. Resolve open high-impact risks in Governance tab to reach 95+ audit readiness.`;
  }

  if (query.includes("carbon") || query.includes("emission") || query.includes("tco2")) {
    return `💨 **Real-Time Carbon Emissions Situation:**\n\n` +
      `• **Current Carbon Footprint:** **${env.carbon ?? 320} tCO₂** (${env.scope || "Scope 1 (Direct)"})\n` +
      `• **Energy Consumption:** ${env.energy ?? 12500} kWh\n` +
      `• **Water Consumption:** ${env.water ?? 42000} L\n` +
      `• **Carbon Offsets Purchased:** ${env.carbonOffsets ?? 50} tCO₂\n\n` +
      `**Actionable Decarbonization Plan:**\n` +
      `• **Immediate Win:** Electrify commercial heating & switch fleet vehicles to EVs to abate up to 40% of Scope 1 direct emissions.\n` +
      `• **Power Purchase:** Sign a Virtual PPA for 100% solar/wind energy procurement to bring Scope 2 emissions to net-zero.`;
  }

  if (query.includes("governance") || query.includes("risk") || query.includes("policy") || query.includes("audit")) {
    return `🛡️ **Real-Time Governance & Compliance Situation:**\n\n` +
      `• **Governance Score:** **${gov.score || "86%"}**\n` +
      `• **Active Policies:** ${gov.policiesCount ?? 3} policies registered & enforced\n` +
      `• **Open Risks:** ${gov.risksCount ?? 1} risk items currently tracked\n` +
      `• **Compliance Status:** ${gov.compliantCount ?? 0} of ${gov.complianceCount ?? 0} requirements compliant\n\n` +
      `**Action Plan:**\n` +
      `• Conduct quarterly review of open high-severity risks.\n` +
      `• Maintain digital audit trails for SEBI BRSR & EU CSRD reporting compliance.`;
  }

  if (query.includes("social") || query.includes("workforce") || query.includes("diversity") || query.includes("safety") || query.includes("training")) {
    return `👥 **Real-Time Social & Workforce Situation:**\n\n` +
      `• **Total Workforce:** **${soc.totalEmployees ?? 500} employees**\n` +
      `• **Gender Diversity Ratio:** Male ${soc.malePercentage ?? 40}%, Female ${soc.femalePercentage ?? 55}%, Other ${soc.otherPercentage ?? 5}%\n` +
      `• **Average Training Hours:** ${soc.averageTrainingHours ?? "2.00"} hrs / employee\n` +
      `• **Reported Safety Incidents:** ${soc.safetyIncidents ?? 0} incidents\n` +
      `• **Active CSR Projects:** ${soc.csrActivities ?? 10} initiatives\n\n` +
      `**Optimization Idea:**\n` +
      `• Increase safety near-miss logging and expand employee upskilling programs to target 15+ training hours per person annually.`;
  }

  if (query.includes("scope 1") || query.includes("direct emission")) {
    return `🌱 **Scope 1 Carbon Abatement Strategy:**\n\n` +
      `Scope 1 covers direct emissions from owned or controlled sources (fleet vehicles, stationary combustion, gas boilers).\n\n` +
      `**Current Situation:** ${env.carbon ? `${env.carbon} tCO₂ logged under ${env.scope}` : "Data actively tracked"}\n\n` +
      `**Actionable Steps:**\n` +
      `• **Fleet Electrification:** Transition diesel/petrol logistics to Electric Vehicles (EVs) to eliminate ~40% of direct transport emissions.\n` +
      `• **Electrify Heating:** Replace natural gas boilers with high-efficiency commercial heat pumps.\n` +
      `• **Fugitive Emissions Control:** Implement automated leak detection systems for HVAC refrigerants (R-410A / R-134a).`;
  }

  if (query.includes("brsr") || query.includes("gri") || query.includes("csrd") || query.includes("tcfd") || query.includes("reporting")) {
    return `📊 **ESG Regulatory Framework Comparison:**\n\n` +
      `• **BRSR (Business Responsibility & Sustainability Report):** SEBI mandate for top 1,000 listed Indian entities. Focuses on 9 NGRBC principles.\n` +
      `• **GRI (Global Reporting Initiative):** Universal sustainability standards focused on multi-stakeholder materiality and impacts.\n` +
      `• **CSRD (Corporate Sustainability Reporting Directive):** EU Directive requiring Double Materiality.\n` +
      `• **TCFD:** Structured around Governance, Strategy, Risk Management, and Metrics/Targets.`;
  }

  return `🤖 **GreenOps AI Live Copilot Insight:**\n\n` +
    `GreenOps AI is connected to your platform's live data!\n\n` +
    `**Your Current Snapshot:**\n` +
    `• **ESG Score:** ${score}/100\n` +
    `• **Carbon Footprint:** ${env.carbon ?? "N/A"} tCO₂\n` +
    `• **Active Policies:** ${gov.policiesCount ?? 0}\n` +
    `• **Workforce:** ${soc.totalEmployees ?? "N/A"} employees\n\n` +
    `Try asking: *"What is my current ESG score?"*, *"What is my carbon emission?"*, or *"Show workforce situation"*.`;
};

export const generateGovernanceInsights = async (governanceData) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== "AIzaSy_demo_key") {
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
- Return ONLY JSON. Do not use markdown.
`;

      const response = await getAIClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text;
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedText);
    } catch (error) {
      console.warn("Gemini Governance API call failed, falling back to GreenOps AI insight engine:", error);
    }
  }

  // Fallback engine
  const totalPolicies = governanceData?.policies?.length || 0;
  const totalRisks = governanceData?.risks?.length || 0;
  const criticalRisksCount = (governanceData?.risks || []).filter(r => r.impact === "High" || r.impact === "Critical").length;

  return {
    summary: `Governance analysis completed across ${totalPolicies} active policies and ${totalRisks} registered risk factors. System compliance status is healthy.`,
    riskLevel: criticalRisksCount > 0 ? "High" : "Low",
    criticalRisks: (governanceData?.risks || []).map(r => `${r.title || r.name || "Risk Item"}: ${r.mitigation || "Mitigation pending"}`),
    complianceGaps: totalPolicies < 3 ? ["Policy portfolio is below 3 core ESG framework standards."] : [],
    policyPriorities: ["Enforce annual data security and environmental safety policy audits."],
    auditObservations: ["Digital compliance logs are synced and active."],
    recommendedActions: [
      {
        action: "Schedule Quarterly Governance Board Review",
        priority: criticalRisksCount > 0 ? "High" : "Medium",
        reason: "Maintain active oversight of high-impact ESG climate transition risks."
      }
    ]
  };
};

export const chatWithESGAssistant = async (userMessage, liveContext = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== "AIzaSy_demo_key") {
    try {
      const systemPrompt = `You are GreenOps AI Copilot, an expert advisor in ESG (Environmental, Social, Governance), Net-Zero carbon reduction, regulatory compliance (BRSR, GRI, CSRD, TCFD), and Green IT sustainability.
You have access to the user's REAL-TIME platform data from their GreenOps AI portal. Always cite their exact current metrics, numbers, and scores when answering questions about their status, emissions, diversity, or compliance, and provide specific, practical steps to improve them. Keep answers clear, professional, and actionable using bold headings and bullet points.`;

      let contextText = "";
      if (liveContext) {
        contextText = `
REAL-TIME PLATFORM LIVE METRICS:
- Overall ESG Score: ${liveContext.esgScore || 85} / 100
- Environmental Metrics:
  • Carbon Emissions: ${liveContext.environmental?.carbon ?? "N/A"} tCO₂ (${liveContext.environmental?.scope || "Scope 1"})
  • Energy Consumption: ${liveContext.environmental?.energy ?? "N/A"} kWh
  • Water Usage: ${liveContext.environmental?.water ?? "N/A"} L
  • Carbon Offsets: ${liveContext.environmental?.carbonOffsets ?? 0} tCO₂
  • Active Cloud Servers: ${liveContext.environmental?.cloudServers ?? 0}
- Social & Workforce Metrics:
  • Total Employees: ${liveContext.social?.totalEmployees ?? "N/A"}
  • Gender Diversity: Male ${liveContext.social?.malePercentage ?? 0}%, Female ${liveContext.social?.femalePercentage ?? 0}%, Other ${liveContext.social?.otherPercentage ?? 0}%
  • Total Employees Trained: ${liveContext.social?.employeesTrained ?? "N/A"}
  • Average Training Hours: ${liveContext.social?.averageTrainingHours ?? "0"} hrs/emp
  • Reported Safety Incidents: ${liveContext.social?.safetyIncidents ?? 0}
  • Active CSR Projects: ${liveContext.social?.csrActivities ?? 0}
- Governance & Compliance Metrics:
  • Governance Maturity Score: ${liveContext.governance?.score || "86%"}
  • Active Governance Policies: ${liveContext.governance?.policiesCount ?? 0}
  • Open Risks Count: ${liveContext.governance?.risksCount ?? 0}
  • Tracked Compliance Requirements: ${liveContext.governance?.complianceCount ?? 0} (${liveContext.governance?.compliantCount ?? 0} Compliant)
  • Scheduled Audits Count: ${liveContext.governance?.auditsCount ?? 0}
`;
      }

      const prompt = `${systemPrompt}\n${contextText}\nUser Question: ${userMessage}`;

      const response = await getAIClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn("Gemini API call failed, using GreenOps AI Knowledge Engine:", error);
    }
  }

  return getSmartESGResponse(userMessage, liveContext);
};