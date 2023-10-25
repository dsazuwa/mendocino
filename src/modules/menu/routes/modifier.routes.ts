import { Router } from 'express';

import {
  getModifier,
  getItemModifiers,
} from '@menu/controllers/modifier.controller';

const modifierRouter = Router();

modifierRouter.get('/:id', getModifier);
modifierRouter.get('/item/:id', getItemModifiers);

export default modifierRouter;
