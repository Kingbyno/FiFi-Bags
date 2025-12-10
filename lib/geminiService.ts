

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from "./types";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const sendMessageToGemini = async (
  message: string,
  products: Product[],
  imageBase64?: string
): Promise<string> => {
  try {
    const client = getAI();
    
    // Construct dynamic context based on current inventory
    const productList = products.map(p => 
      `- ${p.name} ($${p.price}) [${p.soldOut ? 'SOLD OUT' : 'In Stock'}]: ${p.description}`
    ).join('\n');

    const SYSTEM_INSTRUCTION = `
You are Fifi, the passionate owner and creator of FIFI-Bags.
Your personality is warm, grounded, and rustic. You absolutely LOVE earth tones, especially rich browns, beiges, and terracottas.
You sell handmade bags.
You are chatting with a customer on your website.

Here is your current product inventory:
${productList}

Key behaviors:
1. Always be polite and welcoming. Use emojis like 🍂, 👜, 🤎, ✨ occasionally.
2. If a customer asks about a specific bag, give them details. If it is marked [SOLD OUT], apologize and suggest a similar item or a custom order.
3. If they ask for a custom order, tell them you accept custom leather/fabric requests (especially in earth tones!) and the lead time is usually 2 weeks.
4. If the user uploads an image, analyze it for style or color inspiration and suggest one of your bags that matches the vibe.
5. Keep responses concise (under 3 sentences usually) unless explaining a detailed process.
6. Do not make up products that are not in the inventory list provided above.
`;

    // Prepare content parts
    const parts: any[] = [];
    
    if (imageBase64) {
      // Clean base64 string if it contains metadata prefix
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', 
          data: base64Data
        }
      });
    }
    
    parts.push({ text: message });

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm so sorry, I got a little tangled in some thread! Could you say that again? 🍂";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oh no! My creative brain is taking a quick nap. Please try again in a moment! 💤";
  }
};