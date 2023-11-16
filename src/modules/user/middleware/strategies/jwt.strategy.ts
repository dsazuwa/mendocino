import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import userService from '../../services/user.service';

const { JWT_SECRET } = process.env;

export const configureJwtStrategy = (passportStatic: PassportStatic) => {
  passportStatic.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const { email, provider } = jwt_payload;

          const user = await userService.getUserFromPayload(email, provider);

          done(null, user);
        } catch (err) {
          done(err, false);
        }
      },
    ),
  );
};
