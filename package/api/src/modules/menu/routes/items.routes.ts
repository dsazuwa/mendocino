import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import { ROLES, authenticate, authorize } from '../../user';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
  updateItemStatus,
} from '../controllers/items.controller';
import {
  createItemSchema,
  deleteItemSchema,
  updateItemSchema,
  updateItemStatusSchema,
} from '../middleware/item.validator';

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

itemRouter.patch(
  '/:id',
  authorize([SUPER_ADMIN]),
  trimRequestBody,
  validate(updateItemSchema),
  updateItem,
);

itemRouter.patch(
  '/:id/status',
  authorize([MANAGER]),
  trimRequestBody,
  validate(updateItemStatusSchema),
  updateItemStatus,
);

itemRouter.delete(
  '/:id',
  authorize([SUPER_ADMIN]),
  validate(deleteItemSchema),
  deleteItem,
);

export default itemRouter;
