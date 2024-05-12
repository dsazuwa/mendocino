import { NextFunction, Request, Response } from 'express';

const redirectToApiOnRootGet = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === 'GET' && req.path === '/') res.redirect(301, '/api');

  next();
};

export default redirectToApiOnRootGet;
