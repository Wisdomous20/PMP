"use client";

import { useState, useEffect } from "react";
import { getServiceRequestById } from "@/lib/service-request/fetch-service-request";

export default function useGetServiceRequestDetails(serviceRequestId: string) {
  const [serviceRequestDetails, setServiceRequestDetails] =
    useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceRequestDetails = async (serviceRequestId: string) => {
    try {
      const serviceRequestDetailsInitial = await getServiceRequestById(
        serviceRequestId
      );
      setServiceRequestDetails(serviceRequestDetailsInitial as ServiceRequest);
      setLoading(false);
    } catch (err) {
      setError("Failed to load service request details.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServiceRequestDetails(serviceRequestId);
  }, [serviceRequestId]);

  return { serviceRequestDetails, error, loading };
}
