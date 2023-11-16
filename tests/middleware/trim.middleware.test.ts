import { NextFunction, Request, Response } from 'express';

import { trimRequestBody } from '../../src/middleware';

describe('Trim Request Middleware', () => {
  it('should trim string and number values in req.body', () => {
    const req = {
      body: {
        name: '   John Doe   ',
        age: 25,
        email: '   john@example.com   ',
      },
    };

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    trimRequestBody(req as Request, res, next);

    expect(req.body).toEqual({
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should not modify non-string and non-number values in req.body', () => {
    const req = {
      body: {
        name: '   John Doe   ',
        age: 25,
        email: '   john@example.com   ',
        isAdmin: true,
        address: {
          street: '   123 Example St   ',
          city: '   New York   ',
          country: '   USA   ',
          tags: {
            one: '  a tag ',
            two: 'another tag     ',
          },
        },
      },
    };

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    trimRequestBody(req as Request, res, next);

    expect(req.body).toEqual({
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      isAdmin: true,
      address: {
        street: '123 Example St',
        city: 'New York',
        country: 'USA',
        tags: {
          one: 'a tag',
          two: 'another tag',
        },
      },
    });

    expect(next).toHaveBeenCalledTimes(1);
  });
});
