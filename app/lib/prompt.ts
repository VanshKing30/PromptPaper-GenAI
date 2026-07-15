import { Message } from "./types";

export function buildPrompt(
  question: string,
  context: string,
  history: Message[]
) {
  const conversation = history
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`
    )
    .join("\n");

  return `
You are an intelligent AI assistant that answers questions about an uploaded document.

Instructions:

- Use the retrieved document context as your primary source of truth.
- Use the conversation history to understand follow-up questions, references like "he", "it", "that", "those", or "which one".
- If the current question depends on previous conversation, combine the conversation history with the retrieved context.
- Do not make up information that is not supported by the document.
- If the answer truly cannot be found in the document, reply:
  "I couldn't find that information in the uploaded document."

=========================
Conversation History
=========================

${conversation || "No previous conversation."}

=========================
Retrieved Context
=========================

${context}

=========================
Current Question
=========================

${question}

Answer:
`;
}