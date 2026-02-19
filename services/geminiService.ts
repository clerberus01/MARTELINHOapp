
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeItemForDesapego = async (title: string, description: string, imageBase64?: string) => {
  const prompt = `
    Você é o curador especialista do app "Martelinho", um app de intermediação de vendas diretas e desapegos.
    
    Analise este item que o usuário deseja anunciar:
    Título: ${title}
    Descrição: ${description}
    
    SUAS TAREFAS:
    1. Verifique se o item é permitido. Bloqueie (isAllowed: false) itens como: drogas, armas, serviços ilegais, ou veículos que exigem transferência de documento complexa (carros/motos inteiros). Itens de uso comum (eletrônicos, móveis, ferramentas, peças) são permitidos.
    2. Crie um "suggestedTitle": Um título curto, profissional e impactante para vender rápido.
    3. Crie uma "curatedDescription": Uma descrição limpa, organizada e sem erros, destacando os pontos fortes do produto.
    4. Gere um "energyScore": Nota de 1 a 10 baseada na qualidade do anúncio e demanda do item.
    5. Crie uma "energyMessage": Uma frase curta e empolgante que aparecerá no anúncio para incentivar as pessoas a darem lances agora.
    
    IMPORTANTE: Use um tom "Brutalista", direto ao ponto, honesto e vibrante.
    Retorne estritamente em JSON.
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

  const resultText = response.text || '{}';
  return JSON.parse(resultText);
};

export const generateAuctionUpdate = async (auctionTitle: string, currentBid: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `O item "${auctionTitle}" recebeu um novo lance de R$ ${currentBid}. Incentive outros interessados no app Martelinho a cobrirem esse lance agora de forma direta e empolgante.`
  });
  return response.text;
};

export const generateLiveScript = async (title: string, currentBid: number, description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Apresentador de ofertas no Martelinho. Produto: "${title}" (Lance: R$ ${currentBid}). Descrição: "${description}". Crie 3 argumentos rápidos e matadores para eu falar em uma live de 30 segundos incentivando lances imediatos.`
  });
  return response.text;
};
