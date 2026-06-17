import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!adminAuth.ensureConfigured()) {
    return NextResponse.json(
      { authenticated: false, reason: 'not_configured' },
      { status: 500 },
    );
  }

  const result = adminAuth.require(request);
  if (!result.ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

