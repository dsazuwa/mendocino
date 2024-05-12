import { config } from 'dotenv';

import createApp from './app';
import redisClient from './cache';
import sequelize from './db';
import logger from './utils/logger';

config();

const { API_PORT } = process.env;

const app = createApp();

sequelize
  .authenticate()
  .then(async () => {
    logger.info('Connection to DB has been established');

    // redisClient.on('error', (err) => logger.error('Redis Client Error: ', err));
    // await redisClient.connect().then(() => logger.info('Connected to redis'));
  })
  .catch((err) => {
    logger.error('Error on connect to DB:', err);
    process.exit(1);
  });

const server = app.listen(API_PORT, () => {
  logger.info(`The application is listening on port ${API_PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: shutting down gracefully');
  server.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close();
  process.exit(1);
});
