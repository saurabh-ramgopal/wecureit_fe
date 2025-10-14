import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    // Very small dummy validation
    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'Email and password required' }, { status: 400 });
    }

    // Example: accept any credential but demonstrate different responses
    const isDemoUser = email === 'demo@wecureit.test' && password === 'password123';

    if (isDemoUser) {
      return NextResponse.json({ ok: true, message: 'Logged in (demo user)', user: { email } });
    }

    // Echo back for debugging
    return NextResponse.json({ ok: true, message: 'Received credentials (dummy)', received: { body } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Server error' }, { status: 500 });
  }
}
