import { Router } from 'express';

import {
  getMenu,
  getMenuGrouped,
  getOrderMenu,
} from '../controllers/menu.controller';

const menuRouter = Router();

menuRouter.get('', getMenu);
menuRouter.get('/grouped', getMenuGrouped);
menuRouter.get('/order', getOrderMenu);

export default menuRouter;
