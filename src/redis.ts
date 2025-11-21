import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`
});

client.on('error', (err) => console.log('❌ Erro no Redis Client', err));
client.on('connect', () => console.log('✅ Conectado ao Redis!'));

(async () => {
  await client.connect();
  await client.set('ingressos_disponiveis', '5'); 
})();

export default client;