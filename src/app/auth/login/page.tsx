"use client";

import Login from "@/components/auth/Login";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
