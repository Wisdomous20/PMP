"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const DynamicCreateServiceRequest = dynamic(
  () => import('@/components/service-request/CreateServiceRequest'),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-blue-50 p-6 sm:p-10">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 sm:mb-8 self-start"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>
      <div className="flex-grow flex items-center justify-center">
        <Suspense fallback={<div>Loading Page...</div>}>
          <DynamicCreateServiceRequest />
        </Suspense>
      </div>
    </div>
  );
}