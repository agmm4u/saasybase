import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Magic-link sign-in is disabled. Use your email and password.' },
    { status: 410 },
  );
}
