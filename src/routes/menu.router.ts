import { Router } from 'express';
import { getMenu, getMenuGroupedBy } from '../controllers/menu.controller';
import { menuGroupingRules, validate } from '../middleware/validator.middleware';

export const menuRouter = Router();

menuRouter.get('/', getMenu);
menuRouter.get('/group', menuGroupingRules, validate, getMenuGroupedBy);
