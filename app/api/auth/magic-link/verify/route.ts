import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Email-link sign-in is disabled. Use your email and password.' },
    { status: 410 },
  );
}
