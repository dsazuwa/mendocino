import { agent as _request } from 'supertest';

import createApp from '@App/app';

export const request = _request(createApp());
