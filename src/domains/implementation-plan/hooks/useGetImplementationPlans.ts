import { useState, useEffect } from "react";
import fetchGetImplementationPlans from "../services/fetchGetImplementationPlans";
import useGetSessionData from "@/domains/user-management/hooks/useGetSessionData";

export default function useGetImplementationPlans() {
  const [implementationPlans, setImplementationPlans] =
    useState<ImplementationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData: session } = useGetSessionData();

  const fetchImplementationPlan = async () => {

    if (session?.user.id) {
      try {
        const plans = await fetchGetImplementationPlans(session.user.id);
        setImplementationPlans(plans);
      } catch (err) {
        setError("Failed to load implementation plans.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (session) {
      fetchImplementationPlan();
    }
    fetchImplementationPlan();
  }, [session]);

  return { implementationPlans, loading, error };
}
