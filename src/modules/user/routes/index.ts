import { Router } from 'express';

import addressRouter from './address.route';
import authRouter from './auth.route';
import phonesRouter from './phone.routes';
import usersRouter from './users.routes';

const userRouter = Router();

userRouter.use('/address', addressRouter);
userRouter.use('/auth', authRouter);
userRouter.use('/phone', phonesRouter);
userRouter.use('/users/me', usersRouter);

export default userRouter;
