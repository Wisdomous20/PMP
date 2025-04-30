"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useRef } from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    initialized.current = true;
  }

  return <Provider store={store}>{children}</Provider>;
}