import { ai } from "./gemini";
import { Message } from "./types";
import { buildPrompt } from "./prompt";
export async function generateAnswer(
    question: string,
    context: string,
    history: Message[]
): Promise<string> {
  const prompt = buildPrompt(
    question,
    context,
    history
);

    const response = await ai.models.generateContent({
        model : "gemini-2.5-flash",
        contents : prompt,
    });

    return response.text ?? "No response generated.";    
}