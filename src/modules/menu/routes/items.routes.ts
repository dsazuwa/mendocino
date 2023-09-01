import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import { authenticate, authorize, ROLES } from '@App/modules/user';

import { createItem, getItems } from '@menu/controllers/items.controller';
import { createItemSchema } from '@menu/middleware/item.validator';

const MANAGER = ROLES.MANAGER.name;
const SUPER_ADMIN = ROLES.SUPER_ADMIN.name;

const itemRouter = Router();

itemRouter.use(authenticate);

itemRouter.get('', authorize([MANAGER, SUPER_ADMIN]), getItems);

itemRouter.post(
  '',
  authorize([SUPER_ADMIN]),
  trimRequestBody,
  validate(createItemSchema),
  createItem,
);

export default itemRouter;
