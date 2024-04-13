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
  const hasAccessToken = cookies().get('access-token') !== undefined;
  const hasRefreshToken = cookies().get('refresh-token') !== undefined;

  let authCookies: AuthCookies | undefined = undefined;

  if (!hasAccessToken && hasRefreshToken) {
    const refreshResponse = await refreshAuthTokens();

    if (refreshResponse.status === 200) {
      const { accessToken, refreshToken } = (await refreshResponse.json()) as {
        accessToken: string;
        refreshToken: string;
      };

      authCookies = getAuthCookieObject(accessToken, refreshToken);
    }
  }

  const accessToken =
    cookies().get('access-token')?.value || authCookies?.accessToken.value;

  const response = accessToken
    ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'force-cache',
      })
    : undefined;

  const nextResponse = await getNextResponse(request, response);
  nextResponse.headers.set('x-pathname', request.nextUrl.pathname);

  if (authCookies) {
    nextResponse.cookies.set(authCookies.accessToken);
    nextResponse.cookies.set(authCookies.refreshToken);
  }

  if (response?.status !== 200) {
    nextResponse.cookies.delete('access-token');
    nextResponse.cookies.delete('refresh-token');
  }

  applySetCookie(request, nextResponse);

  return nextResponse;
}

async function refreshAuthTokens() {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: cookies().toString() },
    });
  } catch (error) {
    console.error('Error refreshing token: ', error);
    throw error;
  }
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
