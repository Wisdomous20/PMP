"use client";

import dynamic from 'next/dynamic';

const UpdatePassword = dynamic(
  () => import('@/components/auth/UpdatePassword'),
  { ssr: false }
);

export default function Page() {
  return <UpdatePassword />;
}
