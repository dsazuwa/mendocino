import { Router } from 'express';

import mRouter from './menu.routes';

const menuRouter = Router();

menuRouter.use('/', mRouter);

export default menuRouter;
