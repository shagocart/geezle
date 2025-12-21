
import { GoogleGenAI, Type } from "@google/genai";

// specific check to see if the key is actually set and not just the placeholder
const apiKey = process.env.API_KEY;
const isAiEnabled = apiKey && apiKey.length > 20 && apiKey !== 'your_google_gemini_api_key_here';

let ai: GoogleGenAI | null = null;

if (isAiEnabled) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKey });
  } catch (error) {
    console.warn("Failed to initialize Google GenAI, falling back to mock mode.");
  }
}

export const getTagSuggestions = async (title: string, description: string, category: string): Promise<string[]> => {
  // Fallback if AI is not enabled
  if (!ai) {
    console.log("AI not enabled: Returning mock tags");
    return ["Mock Tag 1", "Mock Tag 2", "Development Mode", category || "General"];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 relevant, high-ranking search keywords/tags for a freelance marketplace listing.
      Title: ${title}
      Category: ${category}
      Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("AI Tag Suggestion Error", error);
    return ["Error Fallback", "Manual Tag"];
  }
};

export const getSupportResponse = async (
  message: string, 
  role: 'Freelancer' | 'Employer', 
  history: {sender: string, text: string}[]
): Promise<string> => {
  // Fallback if AI is not enabled
  if (!ai) {
    return "I am currently running in **Demo Mode** because no API Key was provided during deployment.\n\nIn a real deployment, I would use Google Gemini to answer your question: \"" + message + "\" based on the context of being a " + role + ".";
  }

  try {
    // Construct conversation history for context
    const conversationHistory = history.map(h => 
      `${h.sender === 'user' ? 'User' : 'Jima'}: ${h.text}`
    ).join('\n');

    const prompt = `
      You are Jima, AtMyWorks' AI Customer Support Agent.
      
      CONTEXT:
      - Platform: AtMyWorks (a premium freelance marketplace similar to Upwork/Fiverr).
      - User Role: ${role} (The user is currently acting as a ${role}).
      - Tone: Professional, helpful, concise, and friendly.
      
      INSTRUCTIONS:
      - Answer the user's question specifically regarding the AtMyWorks platform.
      - If they ask about payments, mention the secure escrow system.
      - If they ask about verification, mention the KYC process (ID upload).
      - If the user wants to change their role, tell them to type "switch".
      - If the user explicitly asks for a human agent or says they are not satisfied, instruct them to click the 'Agent' button in the chat header.
      - Keep responses under 50 words unless detailed explanation is needed.
      
      CONVERSATION HISTORY:
      ${conversationHistory}
      
      User: ${message}
      Jima:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I'm having trouble connecting to the server. Please try again.";
  } catch (error) {
    console.error("AI Support Error", error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
  }
};
