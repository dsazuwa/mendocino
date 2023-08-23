import { Router } from 'express';

import { getUserData } from '@user/controllers/users.controller';
import authenticate from '@user/middleware/auth/authenticate';

const usersRouter = Router();

usersRouter.get('/me', authenticate, getUserData);

export default usersRouter;
