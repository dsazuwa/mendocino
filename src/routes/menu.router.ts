import { Router } from 'express';
import { getMenu, getMenuGroupedBy, getMenuItemById } from '../controllers/menu.controller';
import validate, { getByIdRules, menuGroupingRules } from '../middleware/validator';

export const menuRouter = Router();

menuRouter.get('/', getMenu);
menuRouter.get('/group', menuGroupingRules, validate, getMenuGroupedBy);
menuRouter.get('/:id', getByIdRules, validate, getMenuItemById);
