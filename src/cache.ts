import { createClient } from 'redis';

// import logger from './utils/logger';

const { REDIS_URL, REDIS_PASSWORD } = process.env;

const redisClient = createClient({ url: REDIS_URL, password: REDIS_PASSWORD });

// (async () => {
//   redisClient.on('error', (err) => logger.error('Redis Client Error: ', err));

//   await redisClient.connect().then(() => logger.info('Connected to redis'));
// })();

export default redisClient;
