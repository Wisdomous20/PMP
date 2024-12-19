"use client";

import { useState, useEffect } from "react";
import useGetSessionData from "./useGetSessionData";
import getUserRoleFetch from "@/domains/user-management/services/getUserRoleFetch";

export default function useGetUserRole() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData: session } = useGetSessionData();

  const fetchUserRole = async () => {
    if (session?.user.id) {
      try {
        const serviceRequestsInitial = await getUserRoleFetch(session.user.id);
        setUserRole(serviceRequestsInitial.userRole);
        setLoading(false);
      } catch (err) {
        setError("Failed to load service requests.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserRole();
    }
  }, [session]);

  return { userRole, loading, error };
}
