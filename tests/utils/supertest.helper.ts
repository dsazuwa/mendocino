import { agent as _request } from 'supertest';
import { createApp } from '../../src/app';

export const request = _request(createApp());
