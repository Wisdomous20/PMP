import { NextResponse } from 'next/server';
import { sendUserVerificationEmail } from '@/domains/notification/services/sendUserVerificationEmail';

export async function POST(request: Request) {
  try {
    const { to, userName, userId, verificationToken, color } = await request.json();
    
    if (!to || !userName || !userId || !verificationToken) {
      return NextResponse.json(
        { error: 'Missing required fields: to, userName, userId, and verificationToken are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await sendUserVerificationEmail({
      to,
      userName,
      userId,
      verificationToken,
      color,
    });

    return NextResponse.json({ success: true, message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Send verification email error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}