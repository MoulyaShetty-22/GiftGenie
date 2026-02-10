
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GiftRecommendation } from "../types";

export const getGiftRecommendations = async (input: UserInput): Promise<GiftRecommendation[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    Act as a world-class gift recommendation expert specializing in the Indian market. 
    Analyze the following recipient profile and provide 5 highly thoughtful, modern, and relevant gift suggestions.
    
    Recipient Details:
    Age: ${input.age}
    Occasion: ${input.occasion}
    Hobbies/Interests: ${input.hobbies}
    Budget: ${input.budget}

    Guidelines:
    - ALL budget categories and price references MUST be in Indian Rupees (INR) using the ₹ symbol.
    - Focus on items available in India (e.g., local artisanal brands, popular e-commerce platforms like Amazon.in, Tata Cliq, etc.).
    - Avoid generic ideas unless they can be personalized.
    - Each recommendation must be comprehensive and culturally relevant to the occasion in an Indian context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              giftName: { type: Type.STRING, description: "GIFT NAME" },
              whyItFits: { type: Type.STRING, description: "WHY IT FITS THIS PERSON" },
              budgetCategory: { type: Type.STRING, description: "APPROXIMATE BUDGET CATEGORY IN INR (e.g., ₹2,000 - ₹3,000)" },
              alternatives: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "ALTERNATIVE OPTIONS" 
              },
              type: { type: Type.STRING, description: "IS IT PRACTICAL OR SENTIMENTAL" },
              targetAudience: { type: Type.STRING, description: "WHO WOULD LOVE THIS MOST" }
            },
            required: ["giftName", "whyItFits", "budgetCategory", "alternatives", "type", "targetAudience"],
          },
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from AI");
    
    const data = JSON.parse(jsonStr) as any[];
    return data.map((item, idx) => ({
      ...item,
      id: btoa(item.giftName + idx).substring(0, 16)
    })) as GiftRecommendation[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch recommendations. Please try again.");
  }
};
