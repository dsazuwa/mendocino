import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes: string[] = ['/account', '/verify'];
const publicOnlyRoutes = ['/login', '/register', '/recover'];

export default function middleware(request: NextRequest) {
  const isAuthenticated = !!request.cookies.get('auth-flag')?.value;
  const { origin, pathname } = request.nextUrl;

  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    const absoluteURL = new URL('/', origin); // TODO: store the return path in query params. Eg- /login?redirect=%2Faccount
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (isAuthenticated && publicOnlyRoutes.includes(pathname)) {
    const absoluteURL = new URL('/', origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
