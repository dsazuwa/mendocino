import { Router } from 'express';
import { getMenu, getMenuGroupedBy, getMenuItemById } from '../controllers/menu.controller';
import { getByIdRules, menuGroupingRules } from '../middleware/menu.validator';
import validate from '../middleware/validate';

export const menuRouter = Router();

menuRouter.get('/', getMenu);
menuRouter.get('/group', menuGroupingRules, validate, getMenuGroupedBy);
menuRouter.get('/:id', getByIdRules, validate, getMenuItemById);
