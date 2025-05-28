import { NextResponse } from 'next/server';

import { auth, signIn, signOut } from '~/auth';
import { locales } from '~/i18n/locales';

import { type MiddlewareFactory } from './compose-middlewares';

function isProtectedRoute(url: string): boolean {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname.toLowerCase();

  if (pathname.startsWith('/account/') || pathname === '/account') {
    return true;
  }

  return locales.some((locale) => {
    const localePrefix = `/${locale}`;

    return (
      pathname.startsWith(`${localePrefix}/account/`) || pathname === `${localePrefix}/account`
    );
  });
}

const sessionInvalidateParam = 'invalidate-session';

function redirectToLogin(url: string) {
  return NextResponse.redirect(new URL('/login', url), { status: 302 });
}

export const withAuth: MiddlewareFactory = (next) => {
  return async (request, event) => {
    // @ts-expect-error: The `auth` function doesn't have the correct type to support it as a MiddlewareFactory.
    const authWithCallback = auth(async (req) => {
      const isProtectedPath = isProtectedRoute(req.nextUrl.toString());
      const isGetRequest = req.method === 'GET';

      if (!req.auth) {
        await signIn('anonymous', { redirect: false });

        if (isProtectedPath && isGetRequest) {
          return redirectToLogin(req.url);
        }

        return next(req, event);
      }

      const { customerAccessToken } = req.auth.user ?? {};

      if (isProtectedPath && isGetRequest && !customerAccessToken) {
        return redirectToLogin(req.url);
      }

      // Continue the middleware chain
      return next(req, event);
    });

    if (request.nextUrl.searchParams.has(sessionInvalidateParam)) {
      await signOut({ redirect: false });

      request.nextUrl.searchParams.delete(sessionInvalidateParam);

      return NextResponse.redirect(request.nextUrl, { status: 302 });
    }

    // @ts-expect-error: The `auth` function doesn't have the correct type to support it as a MiddlewareFactory.
    return authWithCallback(request, event);
  };
};
