import { Router } from 'express';

import {
  getModifier,
  getItemModifiers,
  getChildModifiers,
} from '../controllers/modifier.controller';

const modifierRouter = Router();

modifierRouter.get('/:id', getModifier);
modifierRouter.get('/child/:id', getChildModifiers);
modifierRouter.get('/item/:id', getItemModifiers);

export default modifierRouter;
