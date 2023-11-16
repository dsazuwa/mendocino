import { Router } from 'express';

import { getUserData } from '../controllers/users.controller';
import authenticate from '../middleware/auth/authenticate';

const usersRouter = Router();

usersRouter.get('/me', authenticate, getUserData);

export default usersRouter;
