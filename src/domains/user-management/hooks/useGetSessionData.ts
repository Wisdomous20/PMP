"use client"

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export default function useGetSessionData() {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      setSessionData(session);
      setLoading(false);
    });
  }, []);

  return { sessionData, loading };
}