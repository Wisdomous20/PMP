"use client";

import { useQuery } from "@tanstack/react-query";
import useGetSessionData from "./useGetSessionData";
import { getUserRole } from "@/lib/user/get-user-role";

export default function useGetUserRole() {
  const { sessionData: session } = useGetSessionData();
  const userId = session?.user.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["userRole", userId],
    queryFn: () => getUserRole(userId!),
    enabled: !!userId,
  });

  return {
    userRole: data ?? "USER",
    loading: isLoading,
    error: error || null,
  };
}