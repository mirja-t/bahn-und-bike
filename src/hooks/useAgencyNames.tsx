import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";

export interface UseAgencyNamesReturn {
    agencyName: string | null;
    loading: boolean;
    error: boolean;
}

type Trainline = {
    trainline_id: string;
    trainline_name: string;
    agency_name: string;
};

/**
 * Custom hook to fetch agency name for a given trainline ID
 * @param trainlineId The trainline ID to fetch agency name for
 * @returns Object containing agency name, loading state, and error state
 */
export const useAgencyNames = (trainlineId: string): UseAgencyNamesReturn => {
    const [agencyName, setAgencyName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!trainlineId || trainlineId.trim() === "") {
            setAgencyName(null);
            setLoading(false);
            setError(false);
            return;
        }

        let isCancelled = false;
        setLoading(true);
        setError(false);

        const fetchAgencyName = async () => {
            try {
                const trainlineQuery = `trainline/${trainlineId}`;
                const response = await fetch(
                    `${VITE_API_URL}${trainlineQuery}`,
                    {
                        headers: headers,
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch trainline");
                }

                const trainline: Trainline = await response.json();

                if (!isCancelled) {
                    setAgencyName(trainline.agency_name);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching agency name:", err);
                if (!isCancelled) {
                    setError(true);
                    setLoading(false);
                    setAgencyName(null);
                }
            }
        };

        fetchAgencyName();

        return () => {
            isCancelled = true;
        };
    }, [trainlineId]);

    return {
        agencyName,
        loading,
        error,
    };
};
