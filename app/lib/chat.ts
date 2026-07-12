import { ai } from "./gemini";

export async function generateAnswer(
    question : string,
    context : string
): Promise<string> {
    const prompt = `You are a helpful AI assistatn. 
    Answer ONLY using the provided context.
    If the answer cannot be found in the context, reply: 
    "I couldn't find that information in the document.
    ---------------------------
    Context : 
    ${context}
    
    ----------------------------
    Question : 
    ${question}
    
    Answer: `;

    const response = await ai.models.generateContent({
        model : "gemini-2.5-flash",
        contents : prompt,
    });

    return response.text ?? "No response generated.";    
}