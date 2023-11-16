import { NextFunction, Request, Response } from 'express';

import messages from '../../utils/messages';

const permitPending = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user)
    res.status(401).json({ message: messages.ERR_INVALID_ACCESS_TOKEN });
  else if (user.status !== 'pending')
    res.status(401).json({ message: messages.ERR_VERIFIED_ACCOUNT });
  else next();
};

export default permitPending;
