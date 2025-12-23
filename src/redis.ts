import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "localhost"}:${
    process.env.REDIS_PORT || 6379
  }`;

console.log(`Tentando conectar ao Redis...`);

const redis = new Redis(redisUrl, {
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
  maxRetriesPerRequest: null,
});

redis.on("connect", () => console.log("Conectado ao Redis!"));
redis.on("error", (err) => console.error("Erro no Redis:", err));

export default redis;
