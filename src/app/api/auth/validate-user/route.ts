import { NextResponse } from 'next/server';
import { getTokenData, deleteToken } from '@/lib/tokenVerification';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, token } = await request.json();
    
    if (!userId || !token) {
      return NextResponse.json(
        { error: 'Missing userId or token' },
        { status: 400 }
      );
    }

    const stored = getTokenData(userId);
    if (!stored || stored.token !== token || stored.expires <= new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired verification token' 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    console.log(updatedUser)

    deleteToken(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully! You can now use your account.' 
    });

  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}