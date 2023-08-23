import { Router } from 'express';

import addressRouter from './address.route';
import adminPhoneRouter from './admin-phone.routes';
import authRouter from './auth.route';
import customerPhoneRouter from './customer-phone.router';
import testRouter from './test.route';
import customerRouter from './customer.routes';

const userRouter = Router();

userRouter.use('/auth', authRouter);

userRouter.use('/admins/me/phone', adminPhoneRouter);

userRouter.use('/customers/me', customerRouter);
userRouter.use('/customers/me/address', addressRouter);
userRouter.use('/customers/me/phone', customerPhoneRouter);

userRouter.use('/test', testRouter);

export default userRouter;
