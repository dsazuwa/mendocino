import { Request, Response, Router } from 'express';

import { authenticate } from '@user/middleware/auth/auth';
import { authenticateInactive } from '@user/middleware/auth/inactive.auth';

const usersRouter = Router();

usersRouter.get('/me/greeting', authenticate, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hi!' });
});

usersRouter.get(
  '/me/inactive/greeting',
  authenticateInactive,
  (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hi!' });
  },
);

usersRouter.use(authenticate);

export default usersRouter;
