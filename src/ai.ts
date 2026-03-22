import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface BattleResults {
  winner: 1 | 2 | 0;
  scores: {
    prompt1: { creativity: number; clarity: number; impact: number; total: number };
    prompt2: { creativity: number; clarity: number; impact: number; total: number };
  };
  commentary: string;
  verdict: string;
}

export const judgePrompts = async (prompt1: string, prompt2: string): Promise<BattleResults> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are the ultimate AI judge in a Prompt Battle Arena. 
      Evaluate these two prompts based on creativity, clarity, and impact.
      
      Prompt 1: "${prompt1}"
      Prompt 2: "${prompt2}"
      
      Return a JSON object with:
      - winner: 1 or 2 (or 0 if it's a perfect tie, but try to pick a winner)
      - scores: { 
          prompt1: { creativity: number (0-100), clarity: number (0-100), impact: number (0-100), total: number (0-300) },
          prompt2: { creativity: number (0-100), clarity: number (0-100), impact: number (0-100), total: number (0-300) }
        }
      - commentary: A short, punchy, aggressive wrestling-announcer style commentary on the battle.
      - verdict: A one-sentence final verdict.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winner: { type: Type.INTEGER },
            scores: {
              type: Type.OBJECT,
              properties: {
                prompt1: {
                  type: Type.OBJECT,
                  properties: {
                    creativity: { type: Type.INTEGER },
                    clarity: { type: Type.INTEGER },
                    impact: { type: Type.INTEGER },
                    total: { type: Type.INTEGER }
                  },
                  required: ["creativity", "clarity", "impact", "total"]
                },
                prompt2: {
                  type: Type.OBJECT,
                  properties: {
                    creativity: { type: Type.INTEGER },
                    clarity: { type: Type.INTEGER },
                    impact: { type: Type.INTEGER },
                    total: { type: Type.INTEGER }
                  },
                  required: ["creativity", "clarity", "impact", "total"]
                }
              },
              required: ["prompt1", "prompt2"]
            },
            commentary: { type: Type.STRING },
            verdict: { type: Type.STRING }
          },
          required: ["winner", "scores", "commentary", "verdict"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}") as BattleResults;
  } catch (error) {
    console.error("Error judging prompts:", error);
    throw error;
  }
};
