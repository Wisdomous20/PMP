import { NextResponse } from 'next/server';
import { getTokenData, deleteToken } from '@/lib/tokenVerification';

export async function POST(request: Request) {
  try {
    const { attendeeId, token } = await request.json();
    if (!attendeeId || !token) {
      return NextResponse.json(
        { valid: false },
        { status: 400 }
      );
    }

    const stored = getTokenData(attendeeId);
    if (!stored) {
      return NextResponse.json({ valid: false });
    }

    const now = new Date();
    if (stored.token === token && stored.expires > now) {
      deleteToken(attendeeId);
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
