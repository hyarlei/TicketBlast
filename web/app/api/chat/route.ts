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
      console.error("❌ Chave não encontrada");
      throw new Error("Chave de API ausente");
    }

    const { message } = await req.json();

    const { text } = await generateText({
      model: google("gemini-flash-latest"),

      system: `Você é o suporte do TicketBlast. Seja curto, educado e use emojis. Preços: VIP R$300, Pista R$100.`,
      prompt: message,
    });

    return Response.json({ text });
  } catch (error) {
    console.error("🔥 Erro no Gemini:", error);
    return Response.json(
      { error: "Erro ao gerar resposta da IA. Verifique os logs." },
      { status: 500 }
    );
  }
}
