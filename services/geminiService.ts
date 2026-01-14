
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeItemForDesapego = async (title: string, description: string, imageBase64?: string) => {
  const prompt = `
    Você é o assistente do app "Martelinho", um app de intermediação de vendas diretas por lances.
    NÃO use a palavra "Leilão" de forma oficial. Use termos como "Disputa de Lances", "Oportunidade de Desapego".
    Analise este item:
    Item: ${title}
    Descrição: ${description}
    
    1. Certifique-se que o item é de uso comum e não requer registro oficial (como veículos documentados).
    2. Crie um "Score de Oportunidade" de 1 a 10.
    3. Escreva um comentário empolgante chamando interessados para darem lances.
    4. Melhore o título e a descrição para atrair mais interessados.
    
    Retorne em JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: imageBase64 
      ? { parts: [{ text: prompt }, { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }] }
      : prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          energyScore: { type: Type.NUMBER },
          energyMessage: { type: Type.STRING },
          isAllowed: { type: Type.BOOLEAN },
          curatedDescription: { type: Type.STRING },
          suggestedTitle: { type: Type.STRING }
        },
        required: ["energyScore", "energyMessage", "isAllowed", "curatedDescription", "suggestedTitle"]
      }
    }
  });

  // Extract text output using the .text property (not a method)
  const resultText = response.text || '{}';
  return JSON.parse(resultText);
};

export const generateAuctionUpdate = async (auctionTitle: string, currentBid: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `O item "${auctionTitle}" recebeu um lance de R$ ${currentBid}. Incentive outros interessados a cobrirem esse lance agora de forma empolgante, sem usar a palavra "Leiloeiro".`
  });
  // Use the .text property directly
  return response.text;
};

export const generateLiveScript = async (title: string, currentBid: number, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Apresentador de ofertas estilo TikTok. O produto é "${title}" (Lance atual: R$ ${currentBid}). Descrição: "${description}". Crie argumentos rápidos para eu falar na live incentivando o pessoal a entrar na disputa de lances.`
  });
  // Use the .text property directly
  return response.text;
};
