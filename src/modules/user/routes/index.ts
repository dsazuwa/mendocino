import { Router } from 'express';

import authRouter from './auth.route';
import phonesRouter from './phone.routes';
import usersRouter from './users.routes';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/phone', phonesRouter);
userRouter.use('/users/me', usersRouter);

export default userRouter;
