import { Router } from 'express';
import { getMenu, getMenuGroupedBy } from '../controllers/menu.controller';
import { menuGroupingRules } from '../middleware/menu.validator';
import validate from '../middleware/validate';

export const menuRouter = Router();

menuRouter.get('/', getMenu);
menuRouter.get('/group', menuGroupingRules, validate, getMenuGroupedBy);
