import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { setToken } from '@/lib/tokenVerification';

const VERIFICATION_WINDOW_MINUTES = parseInt(
  process.env.VERIFICATION_WINDOW_MINUTES || '10',
  10
);

export async function POST(request: Request) {
  try {
    const { attendeeId } = await request.json();
    if (!attendeeId) {
      return NextResponse.json(
        { error: 'attendeeId is required' },
        { status: 400 }
      );
    }

    const token = randomBytes(16).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + VERIFICATION_WINDOW_MINUTES);

    setToken(attendeeId, token, expires);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Generate token error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}