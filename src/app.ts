import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import { configureJWTStrategy, errorMiddleware, notFoundHandler } from './middleware';
import { authRouter, usersRouter } from './routes';
import logger from './utils/Logger';

export const createApp = () => {
  const app = express();

  app.use(
    cors({ origin: true, credentials: true }),
    express.urlencoded({ extended: true }),
    express.json(),
    morgan('tiny', {
      stream: {
        write: (message) => {
          logger.http(message.trim());
        },
      },
    }),
    passport.initialize(),
  );

  configureJWTStrategy(passport);

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Spoons API.' });
  });

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);

  // Error Middleware
  app.use(notFoundHandler);
  app.use(errorMiddleware);

  return app;
};
