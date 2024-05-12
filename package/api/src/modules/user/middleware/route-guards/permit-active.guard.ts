import { NextFunction, Request, Response } from 'express';

import messages from '../../utils/messages';

const permitActive = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user)
    res.status(401).json({ message: messages.ERR_INVALID_ACCESS_TOKEN });
  else if (user.status !== 'active')
    res.status(401).json({ message: messages.ERR_VERIFIED_ACCOUNT });
  else next();
};

export default permitActive;
