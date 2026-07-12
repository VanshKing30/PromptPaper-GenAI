import { generateEmbedding } from "./embeddings";
import { getCollection } from "./vectorStore";

export async function retrieveRelevantChunks(question : string , documentId : string){

    const response = await generateEmbedding(question);

    const questionEmbedding = response.embeddings?.[0]?.values;

    if(!questionEmbedding){
        throw new Error("Failed to generate question embedding");
    }

    const collection = await getCollection();

    const results = await collection.query({
  queryEmbeddings: [questionEmbedding],
  nResults: 3,

  where: {
    documentId,
  },

  include: ["documents", "metadatas", "distances"],
});

    console.log(JSON.stringify(results , null , 2));

    const documents = results.documents?.[0] ?? [];

    return documents;
}