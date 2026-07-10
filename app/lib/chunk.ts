interface Chunk {
  id: string;
  text: string;
}

export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  const chunks: Chunk[] = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    const chunk = text.slice(start, end);

    chunks.push({
      id: crypto.randomUUID(),
      text: chunk,
    });

    start += chunkSize - overlap;
  }

  return chunks;
}