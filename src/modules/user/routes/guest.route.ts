import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  createAddress,
  createGuest,
  deleteAddress,
  getAddress,
  updateAddress,
} from '../controllers/guest.controller';
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from '../middleware/validators/address.validator';

const guestRouter = Router();

guestRouter.post('/', createGuest);

guestRouter.get('/me/addresses', getAddress);
guestRouter.post(
  '/me/addresses',
  trimRequestBody,
  validate(createAddressSchema),
  createAddress,
);
guestRouter.patch(
  '/me/addresses/:id',
  trimRequestBody,
  validate(updateAddressSchema),
  updateAddress,
);
guestRouter.delete(
  '/me/addresses/:id',
  validate(deleteAddressSchema),
  deleteAddress,
);

export default guestRouter;
