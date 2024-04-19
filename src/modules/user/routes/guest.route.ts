import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  createAddress,
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

guestRouter.get('/address', getAddress);
guestRouter.post(
  '/address',
  trimRequestBody,
  validate(createAddressSchema),
  createAddress,
);
guestRouter.patch(
  '/:id',
  trimRequestBody,
  validate(updateAddressSchema),
  updateAddress,
);
guestRouter.delete('/:id', validate(deleteAddressSchema), deleteAddress);

export default guestRouter;
