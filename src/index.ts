import { config } from "dotenv";
import { Server } from "http";
import { createApp } from "./app";

const app = createApp();
let server: Server;

config();

const { API_PORT } = process.env;

app.listen(API_PORT, () => console.log(`The application is listening on port ${API_PORT}`));

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // throw reason;
});

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1);
});