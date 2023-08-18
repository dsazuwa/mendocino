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
import { ROLES } from '@user/utils/constants';

const addressRouter = Router();

addressRouter.use([authenticate, authorize([ROLES.CUSTOMER.name])]);

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
