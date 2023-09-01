import { Router } from 'express';

import { getMenu, getMenuGrouped } from '@menu/controllers/menu.controller';

const menuRouter = Router();

menuRouter.get('', getMenu);
menuRouter.get('/grouped', getMenuGrouped);

export default menuRouter;
