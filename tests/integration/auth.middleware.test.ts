import { Request, Response } from 'express';
import {
  permitOnlyActive,
  permitOnlyAdmin,
  permitOnlyClient,
  permitOnlyPending,
} from '../../src/middleware/auth.middleware';
import { User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

describe('Authentication Middleware', () => {
  it('should authenticate the request with a valid access token', async () => {
    const user = await User.create({
      firstName: 'Jess',
      lastName: 'Doe',
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid access token', async () => {
    await request.get('/api/users/me').auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get('/api/users/me').expect(401);
  });

  it('should return 401 Unauthorized for a deactivated account', async () => {
    const user = await User.create({
      firstName: 'Jessica',
      lastName: 'Doe',
      email: 'jessicadoe@gmail.com',
      password: 'jessD0ePs$$',
      status: 'inactive',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(401);
  });
});

describe('PermitOnlyPending middleware', () => {
  it('should permit access to pending user', () => {
    const req = {
      user: { id: 1, status: 'pending', role: 'client' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyPending(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should deny access to non-pending user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'client' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyPending(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('PermitOnlyActive middleware', () => {
  it('should permit access to active user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'client' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyActive(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should deny access to non-active user', () => {
    const req = {
      user: { id: 1, status: 'pending', role: 'client' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyActive(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('PermitOnlyClient middleware', () => {
  it('should permit access to client user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'client' },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    permitOnlyClient(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should deny access to non-client user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'admin' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyClient(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('PermitOnlyAdmin middleware', () => {
  it('should permit access to verified admin user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'admin' },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    permitOnlyAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should deny access to non-verified admin user', () => {
    const req = {
      user: { id: 1, status: 'pending', role: 'admin' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should deny access to non-admin user', () => {
    const req = {
      user: { id: 1, status: 'active', role: 'client' },
    } as unknown as Request;

    const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    permitOnlyAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
