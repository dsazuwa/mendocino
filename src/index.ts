import { config } from 'dotenv';
import { createApp } from './app';
import sequelize from './db';
import { errorHandler, logger } from './utils';

config();

const { API_PORT } = process.env;

const app = createApp();

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection to DB has been established');
  })
  .catch((err) => {
    errorHandler.handleError(err, 'Error on connect to DB:');
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

/* eslint-disable @typescript-eslint/no-unused-vars */
process.on('unhandledRejection', (reason, promise) => {
  throw reason;
});

process.on('uncaughtException', (err) => {
  errorHandler.handleError(err, 'Uncaught Exception:');
  server.close();
  process.exit(1);
});
