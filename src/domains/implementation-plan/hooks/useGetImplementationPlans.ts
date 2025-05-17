import { useState, useEffect } from "react";
import fetchGetImplementationPlans from "../services/fetchGetImplementationPlans";
import useGetSessionData from "@/domains/user-management/hooks/useGetSessionData";
import type { ImplementationPlanCard } from "@/components/implementation-plan/ImplementationPlansBoardNew";

export default function useGetImplementationPlans() {
  const [implementationPlans, setImplementationPlans] =
    useState<ImplementationPlanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sessionData: session } = useGetSessionData();

  const performFetchAndTransform = async () => {
    if (!session?.user?.id) {
      setImplementationPlans([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rawPlans: ImplementationPlan[] = await fetchGetImplementationPlans(session.user.id);

      const transformedPlans: ImplementationPlanCard[] = rawPlans.map((apiPlan) => {
        const cardTasks = apiPlan.tasks.map((apiTask): ImplementationPlanCard['tasks'][0] => ({
          id: apiTask.id,
          title: apiTask.name,
          completed: apiTask.checked,
          startTime: apiTask.startTime instanceof Date ? apiTask.startTime.toISOString() : String(apiTask.startTime),
          endTime: apiTask.endTime instanceof Date ? apiTask.endTime.toISOString() : String(apiTask.endTime),
          assignee: "",
        }));

        return {
          serviceRequestId: apiPlan.serviceRequest.id,
          id: apiPlan.id,
          concern: apiPlan.serviceRequest.concern,
          description: apiPlan.description,
          tasks: cardTasks,
        };
      });

      setImplementationPlans(transformedPlans);
    } catch (err) {
      console.error("Failed to load implementation plans:", err);
      setError("Failed to load implementation plans.");
      setImplementationPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performFetchAndTransform();
  }, [session]);

  return { implementationPlans, loading, error };
}
