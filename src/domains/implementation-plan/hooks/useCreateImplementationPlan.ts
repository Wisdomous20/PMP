import { useState } from "react";
import fetchCreateImplementationPlan from "@/domains/implementation-plan/services/fetchCreateImplementationPlan";

export default function useCreateImplementationPlan() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const createImplementationPlan = async (
        // id: string,
        // description: string,
        // status: string,
        tasks: { id: string; name: string; deadline: Date; checked: boolean }[],
        // files: { id: string; url: string }[]
    ) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await fetchCreateImplementationPlan(tasks);
            setSuccess(true);
        } catch (err) {
            setError("Failed to create implementation plan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { createImplementationPlan, loading, error, success };
}