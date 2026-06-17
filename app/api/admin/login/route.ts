import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!adminAuth.ensureConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_USERNAME/ADMIN_PASSWORD are not set' },
      { status: 500 },
    );
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 },
    );
  }

  if (!adminAuth.verifyCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  adminAuth.attachCookie(response);
  return response;
}

