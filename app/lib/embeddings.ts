import { ai } from "./gemini";
import util from "node:util";

export async function generateEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  console.log(util.inspect(response, {
    depth: null,
    colors: true,
  }));

  return response;
}