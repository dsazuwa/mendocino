import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import {
  errorHandler,
  notFoundHandler,
  redirectToApiOnRootGet,
  syntaxErrorHandlier,
} from './middleware';
import logger from './utils/logger';

import locationsRouter from './modules/location/routes';
import { menuRouter } from './modules/menu';
import {
  configureGoogleStrategy,
  configureJwtStrategy,
  extractJwtFromCookie,
  jwtErrorHandler,
  userRouter,
} from './modules/user';

const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
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

  app.use(extractJwtFromCookie);

  app.use(passport.initialize());

  configureJwtStrategy(passport);
  configureGoogleStrategy(passport);

  app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Spoons API.' });
  });

  app.use('/api', userRouter);
  app.use('/api/menu', menuRouter);
  app.use('/api/locations', locationsRouter);

  app.use(redirectToApiOnRootGet);
  app.use(notFoundHandler);
  app.use(jwtErrorHandler);
  app.use(syntaxErrorHandlier);
  app.use(errorHandler);

  return app;
};

export default createApp;
