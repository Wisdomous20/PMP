import Register from "@/components/auth/Register";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    </div>
  );
}
