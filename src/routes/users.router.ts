import { Request, Response, Router } from 'express';
import { authenticate } from '../middleware';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hey User' });
});
