import { Router } from 'express';

import authRouter from './auth.route';
import usersRouter from './users.routes';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/users/me', usersRouter);

export default userRouter;
