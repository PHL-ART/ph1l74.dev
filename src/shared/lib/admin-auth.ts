import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_token';

const getCredentials = () => ({
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
});

const buildToken = () => {
  const { username, password } = getCredentials();
  if (!username || !password) return null;
  return createHash('sha256').update(`${username}:${password}`).digest('hex');
};

export const adminAuth = {
  cookieName: COOKIE_NAME,

  ensureConfigured(): boolean {
    const { username, password } = getCredentials();
    return Boolean(username && password);
  },

  verifyCredentials(username: string, password: string): boolean {
    const { username: envUser, password: envPass } = getCredentials();
    return Boolean(envUser && envPass && username === envUser && password === envPass);
  },

  expectedToken(): string | null {
    return buildToken();
  },

  attachCookie(response: NextResponse) {
    const token = buildToken();
    if (!token) return response;
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  },

  clearCookie(response: NextResponse) {
    response.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
    return response;
  },

  require(request: NextRequest) {
    const expected = buildToken();
    if (!expected) {
      return {
        ok: false as const,
        response: NextResponse.json(
          { error: 'Admin credentials are not configured' },
          { status: 500 },
        ),
      };
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || token !== expected) {
      return {
        ok: false as const,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      };
    }

    return { ok: true as const, token };
  },
};

