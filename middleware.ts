import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { fetchWithReauth, getAuthCookieObject } from '@/_lib/auth.utils';

const protectedRoutes = ['/account', '/verify'];
const publicOnlyRoutes = ['/login', '/register', '/recover'];

// source: https://github.com/vercel/next.js/discussions/50374#discussioncomment-6732402
function applySetCookie(req: NextRequest, res: NextResponse) {
  const setCookies = new ResponseCookies(res.headers);

  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  dummyRes.headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

// TODO: store the return path in query params. Eg- /login?redirect=%2Faccount
export default async function middleware(request: NextRequest) {
  const { res, refreshResponse } = await fetchWithReauth(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      method: 'GET',
      headers: { cookie: cookies().toString() },
      next: { tags: ['user'] },
      cache: 'force-cache',
    },
  );

  const nextResponse = await getNextResponse(request, res);

  if (refreshResponse?.status === 200) {
    const { accessToken, refreshToken } = (await refreshResponse.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    nextResponse.cookies.delete('access-token');
    nextResponse.cookies.delete('refresh-token');

    const authCookies = getAuthCookieObject(accessToken, refreshToken);

    nextResponse.cookies.set(authCookies.accessToken);
    nextResponse.cookies.set(authCookies.refreshToken);

    applySetCookie(request, nextResponse);
  }

  return nextResponse;
}

async function getNextResponse(request: NextRequest, response: Response) {
  const { origin, pathname } = request.nextUrl;

  if (response.status === 200 && publicOnlyRoutes.includes(pathname)) {
    const absoluteURL = new URL('/', origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (response.status !== 200 && protectedRoutes.includes(pathname)) {
    const absoluteURL = new URL('/', origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (pathname === '/verify') {
    const body = (await response.json()) as { user: { status: string } };

    if (body.user.status !== 'pending') {
      const absoluteURL = new URL('/', origin);

      return NextResponse.redirect(absoluteURL.toString());
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
