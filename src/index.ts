import { config } from 'dotenv';
import { Server } from 'http';
import { createApp } from './app';
import sequelize from './db';
import { errorHandler, logger } from './utils';

config();

const { API_PORT } = process.env;

let server: Server;
const app = createApp();

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection to DB has been established');
    app.listen(API_PORT, () => {
      logger.info(`The application is listening on port ${API_PORT}`);
    });
  })
  .catch((err) => {
    errorHandler.handleError(err);
    process.exit(1);
  });

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: shutting down gracefully');
  server.close(() => {
    sequelize.close();
  });
  process.exit(0);
});

/* eslint-disable @typescript-eslint/no-unused-vars */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

process.on('uncaughtException', (err) => {
  errorHandler.handleError(err);
  server.close(() => {
    sequelize.close();
  });
  process.exit(1);
});
