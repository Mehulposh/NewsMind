import Redis from 'ioredis';

let redis = null;

export const getRedis = () => {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    redis.on('error', (err) => console.error('Redis error:', err.message));
  }
  return redis;
};

export const cacheGet = async (key) => {
  const client = getRedis();
  if (!client) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = 300) => {
  const client = getRedis();
  if (!client) return;
  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    /* ignore cache write failures */
  }
};

export const cacheDel = async (pattern) => {
  const client = getRedis();
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(...keys);
  } catch {
    /* ignore */
  }
};
