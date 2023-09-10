import { JwtPayload, verify } from 'jsonwebtoken';

import tokenService from '@App/modules/user/services/token.service';

describe('generate access token', () => {
  const email = 'janicedoe@gmail.com';

  it('should generate a token for email', async () => {
    const provider = 'email';

    const token = tokenService.generateAccessToken(email, provider);

    const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });

  it('should generate a token for google', async () => {
    const provider = 'google';

    const token = tokenService.generateAccessToken(email, provider);

    const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });

  it('should generate a token for facebook', async () => {
    const provider = 'facebook';

    const token = tokenService.generateAccessToken(email, provider);

    const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });
});
