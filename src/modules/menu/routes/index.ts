import { Router } from 'express';

import itemRouter from './items.routes';
import mRouter from './menu.routes';
import modifierRouter from './modifier.routes';

const menuRouter = Router();

menuRouter.use('/', mRouter);
menuRouter.use('/items', itemRouter);
menuRouter.use('/modifiers', modifierRouter);

export default menuRouter;
