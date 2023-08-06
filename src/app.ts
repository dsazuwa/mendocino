import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import {
  errorHandler,
  notFoundHandler,
  syntaxErrorHandlier,
} from './middleware/error';
import logger from './utils/logger';

import { configureJWTStrategy, userRouter } from './modules/user';

const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    helmet({
      hidePoweredBy: true,
      frameguard: { action: 'deny' },
      xssFilter: true,
      noSniff: true,
    }),
  );

  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => {
          logger.http(message.trim());
        },
      },
    }),
  );

  app.use(passport.initialize());

  configureJWTStrategy(passport);

  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Spoons API.' });
  });

  app.use('/api', userRouter);

  app.use(notFoundHandler);
  app.use(syntaxErrorHandlier);
  app.use(errorHandler);

  return app;
};

export default createApp;
