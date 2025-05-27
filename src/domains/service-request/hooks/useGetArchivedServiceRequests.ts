import { useState, useEffect } from "react";
import useGetSessionData from "@/domains/user-management/hooks/useGetSessionData";
import fetchGetArchivedServiceRequests from "@/domains/service-request/services/fetchGetArchivedServiceRequests";

export interface ArchivedServiceRequest {
  id: string;
  name: string;
  title: string;
  department: string;
  requestDate: string | null;
  status: string;
  deleteAt: string | null;
  concern: string;
  details: string;

  ServiceRequestRating?: {
    ratings: number;
    description: string;
  } | null;
}

export default function useGetArchivedServiceRequests() {
  const [archivedRequests, setArchivedRequests] = useState<
    ArchivedServiceRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData } = useGetSessionData();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function getArchivedRequests() {
      if (sessionData?.user?.id) {
        try {
          setLoading(true);
          const response = await fetchGetArchivedServiceRequests(
            sessionData.user.id
          );

          const sorted = response.sort((a: { requestDate: string | number | Date; }, b: { requestDate: string | number | Date; }) => {
            if (!a.requestDate) return 1;
            if (!b.requestDate) return -1;
            return (
              new Date(b.requestDate).getTime() -
              new Date(a.requestDate).getTime()
            );
          });

          setArchivedRequests(sorted);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching archived service requests:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    }

    if (sessionData) {
      getArchivedRequests();
    }
  }, [sessionData, refreshTrigger]);

  const refreshArchives = () => setRefreshTrigger((prev) => prev + 1);

  return { archivedRequests, loading, error, refreshArchives };
}
