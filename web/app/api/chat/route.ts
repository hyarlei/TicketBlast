import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const { text } = await generateText({
      model: google("gemini-flash-latest"),
      system: `Você é o suporte do TicketBlast. 
      Seja curto, educado e use emojis.
      Preços: VIP R$300, Pista R$100.
      Data: 20/12/2025.`,
      prompt: message,
    });

    return Response.json({ text });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return Response.json(
      { text: "Desculpe, tive um erro no sistema. Tente novamente." },
      { status: 500 }
    );
  }
}
