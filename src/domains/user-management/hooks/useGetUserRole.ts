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
    console.log(session?.user)
    if (session?.user.id) {
      try {
        console.log("fetching user role", session.user.id)
        const serviceRequestsInitial = await getUserRoleFetch(session.user.id);
        console.log(serviceRequestsInitial)
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
      console.log("fetch!")
      fetchUserRole();
    }
  }, [session]);

  return { userRole, loading, error };
}
