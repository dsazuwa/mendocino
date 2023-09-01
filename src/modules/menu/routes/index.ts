import { Router } from 'express';

import itemRouter from './items.routes';
import mRouter from './menu.routes';

const menuRouter = Router();

menuRouter.use('/', mRouter);
menuRouter.use('/items', itemRouter);

export default menuRouter;
