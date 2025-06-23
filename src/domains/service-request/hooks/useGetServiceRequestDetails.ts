"use client";

import { useState, useEffect } from "react";
import fetchGetServiceRequestDetails from "@/domains/service-request/services/fetchGetServiceRequestById";

export default function useGetServiceRequestDetails(serviceRequestId: string) {
  const [serviceRequestDetails, setServiceRequestDetails] =
    useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceRequestDetails = async (serviceRequestId: string) => {
    try {
      const serviceRequestDetailsInitial = await fetchGetServiceRequestDetails(
        serviceRequestId
      );
      setServiceRequestDetails(serviceRequestDetailsInitial);
      setLoading(false);
    } catch (err) {
      setError("Failed to load service request details.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServiceRequestDetails(serviceRequestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { serviceRequestDetails, error, loading };
}
