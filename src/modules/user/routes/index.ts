import { Router } from 'express';

import addressRouter from './address.route';
import adminPhoneRouter from './admin-phone.route';
import adminRouter from './admin.route';
import authRouter from './auth.route';
import customerPhoneRouter from './customer-phone.route';
import customerRouter from './customer.route';
import testRouter from './test.route';
import usersRouter from './users.route';

const userRouter = Router();

userRouter.use('/auth', authRouter);

userRouter.use('/admins/me', adminRouter);
userRouter.use('/admins/me/phone', adminPhoneRouter);

userRouter.use('/customers/me', customerRouter);
userRouter.use('/customers/me/addresses', addressRouter);
userRouter.use('/customers/me/phone', customerPhoneRouter);

userRouter.use('/users', usersRouter);
userRouter.use('/test', testRouter);

export default userRouter;
