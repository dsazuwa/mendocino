import { Router } from 'express';

import { authenticate, authorize, ROLES } from '@App/modules/user';

import { getItems } from '@menu/controllers/items.controller';

const MANAGER = ROLES.MANAGER.name;
const SUPER_ADMIN = ROLES.SUPER_ADMIN.name;

const itemRouter = Router();

itemRouter.use(authenticate);

itemRouter.get('', authorize([MANAGER, SUPER_ADMIN]), getItems);

export default itemRouter;
