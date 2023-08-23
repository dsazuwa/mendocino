import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from '@user/controllers/address.controller';
import { authenticate, authorize } from '@user/middleware/auth';
import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from '@user/middleware/validators/address.validator';

const addressRouter = Router();

addressRouter.use([authenticate, authorize(['customer'])]);

addressRouter.get('', getAddress);
addressRouter.post(
  '',
  trimRequestBody,
  validate(createAddressSchema),
  createAddress,
);
addressRouter.patch(
  '/:id',
  trimRequestBody,
  validate(updateAddressSchema),
  updateAddress,
);
addressRouter.delete('/:id', validate(deleteAddressSchema), deleteAddress);

export default addressRouter;
