const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const MODEL = 'voyage-3-lite';

export const generateEmbedding = async (text) => {
  if (!process.env.VOYAGE_API_KEY) {
    return generateFallbackEmbedding(text);
  }

  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text.slice(0, 8000)],
      model: MODEL,
    }),
  });

  if (!response.ok) {
    throw new Error(`Voyage API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
};

export const generateEmbeddings = async (texts) => {
  if (!process.env.VOYAGE_API_KEY) {
    return texts.map((t) => generateFallbackEmbedding(t));
  }

  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: texts.map((t) => t.slice(0, 8000)),
      model: MODEL,
    }),
  });

  if (!response.ok) throw new Error(`Voyage API error: ${response.statusText}`);
  const data = await response.json();
  return data.data.map((d) => d.embedding);
};

function generateFallbackEmbedding(text, dimensions = 384) {
  const embedding = new Array(dimensions).fill(0);
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 31 + word.charCodeAt(i)) % dimensions;
    }
    embedding[hash] += 1;
  }
  const magnitude = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1;
  return embedding.map((v) => v / magnitude);
}

export const cosineSimilarity = (a, b) => {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
};
