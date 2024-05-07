import { Router } from 'express';

import {
  getClosestLocations,
  getLocationMenu,
  getLocations,
} from './location.controller';

const locationsRouter = Router();

locationsRouter.get('/', getLocations);
locationsRouter.get('/distance/:placeId', getClosestLocations);
locationsRouter.get('/:name/menu', getLocationMenu);

export default locationsRouter;
