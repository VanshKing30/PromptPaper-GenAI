import { chroma } from "./chroma";
import { EmbeddedChunk } from "./rag";

export async function getCollection() {
  const collection = await chroma.getOrCreateCollection({
    name: "pdf_chunks",
  });

  return collection;
}

export async function storeEmbeddings(
  embeddedChunks: EmbeddedChunk[]
) {
  const collection = await getCollection();

  await collection.add({
    ids: embeddedChunks.map((chunk) => chunk.id),

    documents: embeddedChunks.map((chunk) => chunk.text),

    embeddings: embeddedChunks.map((chunk) => chunk.embedding),

    metadatas: embeddedChunks.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber || 0,
    })),
  });

  console.log(`✅ Stored ${embeddedChunks.length} embeddings in ChromaDB`);
}