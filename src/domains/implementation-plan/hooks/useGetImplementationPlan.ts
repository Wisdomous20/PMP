// src/domains/implementation-plan/hooks/useGetImplementationPlan.ts

import { useState, useEffect } from "react";
import fetchGetImplementationPlanById from "@/domains/implementation-plan/services/fetchGetImplementationPlanById";

export default function useGetImplementationPlan(planId: string) {
    const [implementationPlan, setImplementationPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImplementationPlan = async () => {
            if (!planId) return;

            try {
                const plan = await fetchGetImplementationPlanById(planId);
                setImplementationPlan(plan);
            } catch (err) {
                setError("Failed to load implementation plan.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchImplementationPlan();
    }, [planId]);

    return { implementationPlan, loading, error };
}