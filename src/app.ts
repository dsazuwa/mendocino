import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import { authRouter, usersRouter } from './routes';
import { configureJWTStrategy } from './utilities';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(passport.initialize());

  configureJWTStrategy(passport);

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Spoons API.' });
  });

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);

  return app;
};
