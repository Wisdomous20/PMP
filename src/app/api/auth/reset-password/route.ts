import { NextResponse } from 'next/server';
import resetPassword from '@/domains/user-management/services/resetPassword';



export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse the request body
    const { email } = body;

    await resetPassword(email);

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json({ message: 'Failed to send password reset email' }, { status: 500 });
  }
};
