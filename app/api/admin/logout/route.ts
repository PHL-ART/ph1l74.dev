import { NextResponse } from 'next/server';
import { adminAuth } from '@/shared/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  adminAuth.clearCookie(response);
  return response;
}

