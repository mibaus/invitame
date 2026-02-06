
import { GoogleGenAI } from "@google/genai";

export const generateRomanticMessage = async (bride: string, groom: string, theme: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe una frase corta (máximo 150 caracteres) y muy romántica para una invitación de boda de ${bride} y ${groom}. El estilo debe ser ${theme}, neo-retro y con mucha vibra. No uses emojis.`,
    });
    
    return response.text?.trim() || "Nuestra historia de amor continúa...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Juntos, hoy y siempre.";
  }
};
