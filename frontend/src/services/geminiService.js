import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace this with your own Gemini API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const askGemini = async (question) => {
  try {
const prompt = `
You are GreenOps AI, an intelligent ESG Sustainability Assistant integrated into an ESG Management Dashboard.

You have access to the organization's latest dashboard data.

Always analyze the provided dashboard values before answering.

Rules:
- Answer based on the dashboard data first.
- Give practical recommendations using the current Carbon, Energy, Water and ESG Score.
- Keep the response under 80 words.
- Use simple English.
- If the user asks about improving ESG, explain which KPI needs attention based on the provided values.
- Never make up dashboard values.

User Question:
${question}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);

    return "Sorry, I couldn't generate a response.";
  }
};