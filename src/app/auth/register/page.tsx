"use client";

import dynamic from 'next/dynamic';

const Register = dynamic(
  () => import('@/components/auth/Register'),
  { ssr: false }
);

export default function Page() {
  return <Register />;
}