import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AuthCookies, getAuthCookieObject } from '@/lib/auth.utils';

const protectedRoutes = ['/account', '/verify'];
const publicOnlyRoutes = ['/login', '/register', '/recover'];

// TODO: store the return path in query params. Eg- /login?redirect=%2Faccount
export default async function middleware(request: NextRequest) {
  const refreshToken = cookies().get('refresh-token')?.value;
  const guestSession = cookies().get('guest-session')?.value;

  let accessToken = cookies().get('access-token')?.value;
  let authCookies: AuthCookies | undefined = undefined;

  if (!accessToken && refreshToken) authCookies = await refreshAuthTokens();

  accessToken = accessToken || authCookies?.accessToken.value;
  const response = accessToken ? await getUser(accessToken) : undefined;

  const nextResponse = await getNextResponse(request, response);
  nextResponse.headers.set('x-pathname', request.nextUrl.pathname);

  if (authCookies) {
    nextResponse.cookies.set(authCookies.accessToken);
    nextResponse.cookies.set(authCookies.refreshToken);
    nextResponse.cookies.delete('guest-session');
  }

  if (response?.status !== 200) {
    nextResponse.cookies.delete('access-token');
    nextResponse.cookies.delete('refresh-token');
  }

  accessToken = cookies().get('access-token')?.value;

  if (!accessToken && !guestSession) {
    const guestSession = await createGuestSession();
    nextResponse.cookies.set(guestSession);
  }

  applySetCookie(request, nextResponse);

  return nextResponse;
}

async function refreshAuthTokens() {
  try {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { cookie: cookies().toString() },
      },
    );

    if (refreshResponse.status === 200) {
      const { accessToken, refreshToken } = (await refreshResponse.json()) as {
        accessToken: string;
        refreshToken: string;
      };

      return getAuthCookieObject(accessToken, refreshToken);
    }
  } catch (error) {
    console.error('Error refreshing token: ', error);
    throw error;
  }
}

async function getUser(accessToken: string) {
  try {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'force-cache',
    });
  } catch (error) {
    console.error('Error refreshing token: ', error);
    throw error;
  }
}

async function createGuestSession() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guests`, {
    method: 'POST',
  });

  const { sessionId } = (await response.json()) as { sessionId: string };

  return {
    name: 'guest-session',
    value: sessionId,
    secure: true,
    httpOnly: true,
  };
}

async function getNextResponse(
  request: NextRequest,
  response: Response | undefined,
) {
  const { origin, pathname } = request.nextUrl;

  const isPublicRoute = publicOnlyRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!response) {
    if (isPublicRoute) return NextResponse.next();

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/', origin).toString());
    }
  } else {
    if (response.status === 200 && isPublicRoute) {
      return NextResponse.redirect(new URL('/', origin).toString());
    }

    if (response.status !== 200 && isProtectedRoute) {
      return NextResponse.redirect(new URL('/', origin).toString());
    }

    if (pathname === '/verify') {
      const body = (await response.json()) as { user: { status: string } };

      if (body.user.status !== 'pending') {
        return NextResponse.redirect(new URL('/', origin).toString());
      }
    }
  }

  return NextResponse.next();
}

// source: https://github.com/vercel/next.js/discussions/50374#discussioncomment-6732402
// it's days are numbered
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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
