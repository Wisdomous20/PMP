import UpdatePassword from '@/components/auth/UpdatePassword';
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePassword />
      </Suspense>
    </div>
  );
}

