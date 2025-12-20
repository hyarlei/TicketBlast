import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Se a variável REDIS_URL existir (nuvem), usa ela. Se não, monta local.
const redisUrl = process.env.REDIS_URL || 
  `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

console.log(`🔌 Tentando conectar ao Redis...`); // Debug

const redis = new Redis(redisUrl, {
  // Configuração vital para o Upstash (SSL)
  tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: null
});

redis.on('connect', () => console.log('✅ Conectado ao Redis!'));
redis.on('error', (err) => console.error('❌ Erro no Redis:', err));

export default redis;