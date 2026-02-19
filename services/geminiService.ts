
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdUpdate = async (adTitle: string, currentBid: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `O item "${adTitle}" recebeu uma nova oferta de R$ ${currentBid}. Incentive outros interessados no app Martelinho a cobrirem esse lance agora.`
  });
  return response.text;
};

export const generateLiveScript = async (title: string, currentBid: number, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Apresentador de ofertas no Martelinho. Produto: "${title}" (Oferta: R$ ${currentBid}). Descrição: "${description}". Crie 3 argumentos rápidos para eu falar em uma live incentivando lances.`
  });
  return response.text;
};
