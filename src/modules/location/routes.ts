import { Router } from 'express';

import { getClosestLocations } from './location.controller';

const locationsRouter = Router();

locationsRouter.get('/distance/:placeId', getClosestLocations);

export default locationsRouter;
