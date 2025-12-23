import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
      console.error(
        "ERRO CRÍTICO: A variável GOOGLE_GENERATIVE_AI_API_KEY está vazia ou undefined!"
      );
      throw new Error("Chave de API não configurada");
    } else {
      console.log(`Chave detectada! Inicia com: ${key.substring(0, 4)}...`);
    }

    const { message } = await req.json();

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `Você é o suporte do TicketBlast. Seja curto, educado e use emojis. Preços: VIP R$300, Pista R$100.`,
      prompt: message,
    });

    return Response.json({ text });
  } catch (error) {
    console.error("Erro detalhado no Gemini:", error);
    return Response.json(
      { text: "Desculpe, tive um erro no sistema. Tente novamente." },
      { status: 500 }
    );
  }
}
