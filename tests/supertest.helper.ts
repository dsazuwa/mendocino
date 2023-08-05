import { agent as _request } from 'supertest';

import createApp from 'app';

export const request = _request(createApp());
