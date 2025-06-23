"use client";

import { useState, useEffect } from "react";
import useGetSessionData from "../../user-management/hooks/useGetSessionData";
import fetchGetServiceRequest from "@/domains/service-request/services/fetchGetServiceRequest";

export default function useGetServiceRequestList() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData: session } = useGetSessionData();

  const fetchServiceRequests = async () => {
    if (session?.user.id) {
      try {
        const serviceRequestsInitial = await fetchGetServiceRequest(
          session.user.id
        );

        const filteredRequests = serviceRequestsInitial.filter(
          (request: ServiceRequest) => !request.status.some((status) => status.status === "archived")
        );
        const sortedRequests = [...filteredRequests].sort((a, b) => {
          const dateA = a.createdOn ? new Date(a.createdOn) : null;
          const dateB = b.createdOn ? new Date(b.createdOn) : null;
          if (dateA === null && dateB === null) return 0;
          if (dateA === null) return 1;
          if (dateB === null) return -1;
          return dateB.getTime() - dateA.getTime();
        });
        setServiceRequests(sortedRequests);
        setLoading(false);
      } catch (err) {
        setError("Failed to load service requests.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchServiceRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return { serviceRequests, error, loading };
}
