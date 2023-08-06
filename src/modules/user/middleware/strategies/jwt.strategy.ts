import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserIdentity } from '@user/models';
import { authService } from '@user/services';

const { JWT_SECRET } = process.env;

export const configureJWTStrategy = (passportStatic: PassportStatic) => {
  passportStatic.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const { userId, providerType } = jwt_payload;

          const u = await authService.getUserFromJWTPayload(
            providerType,
            userId,
          );

          const user =
            u instanceof UserIdentity
              ? { status: 'active', ...u.dataValues }
              : u;

          done(null, user);
        } catch (err) {
          done(err, false);
        }
      },
    ),
  );
};
