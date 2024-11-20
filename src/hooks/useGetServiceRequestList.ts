'use-client'

import { useState, useEffect } from "react";
import useGetSessionData from "./useGetSessionData";
import getServiceRequestFetch from "@/utils/service-request/getServiceRequestFetch";

export default function useGetServiceRequestList() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData: session } = useGetSessionData();

  const fetchServiceRequests = async () => {
    if (session?.user.id) {
      try {
        const serviceRequestsInitial = await getServiceRequestFetch(session.user.id);
        setServiceRequests(serviceRequestsInitial);
        setLoading(false)
      } catch (err) {
        setError("Failed to load service requests.");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (session) {
      fetchServiceRequests();
    }
    fetchServiceRequests();
  }, [session]);

  return { serviceRequests, error, loading };
}