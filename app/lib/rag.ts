import { extractTextFromPDF } from "./pdf";
import { chunkText } from "./chunk";
import { generateEmbedding } from "./embeddings";
import { storeEmbeddings } from "./vectorStore";

export interface EmbeddedChunk {
  id: string;
  text: string;
  chunkIndex: number;
  pageNumber: number | null;
  embedding: number[];
  documentId : string;
}

export async function processPDF(file: File): Promise<{documentId : string , embeddedChunks : EmbeddedChunk[]}> {
  
const documentId = crypto.randomUUID();
  // Step 1: Extract Text
  const extractedText = await extractTextFromPDF(file);
  console.log("✅ Text Extracted");

  // Step 2: Chunk Text
  const chunks = chunkText(extractedText);
  console.log(`✅ Created ${chunks.length} chunks`);

  const embeddedChunks: EmbeddedChunk[] = [];

  // Step 3: Generate Embeddings
  for (const chunk of chunks) {
    console.log(`Generating embedding for chunk ${chunk.chunkIndex}...`);

    const response = await generateEmbedding(chunk.text);

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error(
        `Failed to generate embedding for chunk ${chunk.chunkIndex}`
      );
    }
    embeddedChunks.push({
    id: chunk.id,
    text: chunk.text,
    chunkIndex: chunk.chunkIndex,
    pageNumber: chunk.pageNumber,
    embedding,
    documentId,
});
  }

  console.log(
    `✅ Generated embeddings for ${embeddedChunks.length} chunks`
  );

  // Step 4: Store in ChromaDB
  await storeEmbeddings(embeddedChunks);

  console.log("✅ Stored embeddings in ChromaDB");

  return {
    documentId,
    embeddedChunks,
  }
}