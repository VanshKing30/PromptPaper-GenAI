import { extractTextFromPDF } from "./pdf";
import { chunkText } from "./chunk";
import { generateEmbedding } from "./embeddings";


export interface EmbeddedChunk {
  id: string;
  text: string;
  chunkIndex: number;
  pageNumber: number | null;
  embedding: number[];
}


export async function processPDF(file: File) {

    console.log("Starting PDF Processing...");

    // Step 1
    const extractedText = await extractTextFromPDF(file);

    console.log("Text Extracted");

    // Step 2
    const chunks = chunkText(extractedText);

    console.log(`Created ${chunks.length} chunks`);
    const embeddedChunks: EmbeddedChunk[] = [];

    for(const chunk of chunks){

     const response = await generateEmbedding(chunk.text);

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error(`Failed to generate embedding for chunk ${chunk.chunkIndex}`);
  }

  embeddedChunks.push({
    ...chunk,
    embedding,
  });
    }

    return embeddedChunks;
}