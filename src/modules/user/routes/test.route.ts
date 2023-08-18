import { Request, Response, Router } from 'express';

import { authenticate, authenticateInactive } from '@user/middleware/auth';

const testRouter = Router();

const greet = (req: Request, res: Response) => {
  res.status(200).json({ message: `Hi!` });
};

testRouter.get('/greeting', authenticate, greet);
testRouter.get('/inactive/greeting', authenticateInactive, greet);

export default testRouter;
