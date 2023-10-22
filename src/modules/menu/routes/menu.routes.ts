import { Router } from 'express';

import {
  getMenu,
  getMenuGrouped,
  getOrderMenu,
} from '@menu/controllers/menu.controller';

const menuRouter = Router();

menuRouter.get('', getMenu);
menuRouter.get('/grouped', getMenuGrouped);
menuRouter.get('/order', getOrderMenu);

export default menuRouter;
