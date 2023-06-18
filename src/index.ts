import { config } from "dotenv";
import { Server } from "http";
import { createApp } from "./app";
import sequelize from "./db";

config();

const { API_PORT } = process.env;

let server: Server;
const app = createApp();

sequelize.authenticate()
  .then(() => {
    console.log('Connection to DB has been established');
    app.listen(API_PORT, () => console.log(`The application is listening on port ${API_PORT}`));
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    sequelize.close();
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // throw reason;
});

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  server.close(() => {
    sequelize.close();
  });
  process.exit(1);
});