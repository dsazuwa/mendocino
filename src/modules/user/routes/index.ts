import { Router } from 'express';

import { usersRouter } from './users.routes';

const userRouter = Router();

userRouter.use('/users', usersRouter);

export default userRouter;
