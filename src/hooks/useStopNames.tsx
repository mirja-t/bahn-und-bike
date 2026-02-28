import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";
import type { ActiveDestination } from "../components/destinationDetails/DestinationDetailsSlice";

export interface UseStopNamesReturn {
    names: Record<string, string | null>;
    loading: boolean;
    error: boolean;
}

export const useStopNames = (ids: string[]): UseStopNamesReturn => {
    const [destinationsMap, setDestinationsMap] = useState<Map<string, string>>(
        new Map(),
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch destinations when needed
    useEffect(() => {
        if (ids.length === 0) return;

        let isCancelled = false;
        setLoading(true);
        setError(false);

        const fetchDestinations = async () => {
            try {
                const validIds = ids.filter((id) => id && id.trim() !== "");
                if (validIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const destinationQuery =
                    "destinations/ids[]=" + validIds.join("&ids[]=");
                const response = await fetch(
                    `${VITE_API_URL}${destinationQuery}`,
                    {
                        headers: headers,
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch destinations");
                }

                const fetchedDestinations: ActiveDestination[] =
                    await response.json();

                if (!isCancelled) {
                    // Create hashmap of id -> name for O(1) lookup
                    const newMap = new Map<string, string>();
                    fetchedDestinations.forEach((dest) => {
                        newMap.set(dest.id, dest.name);
                    });

                    setDestinationsMap(newMap);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching stop names:", err);
                if (!isCancelled) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchDestinations();

        return () => {
            isCancelled = true;
        };
    }, [ids]);

    // Create object with IDs as keys and names as values
    const names = ids.reduce((acc, id) => {
        if (!id || id.trim() === '') {
            acc[id] = null;
        } else {
            acc[id] = destinationsMap.get(id) || null;
        }
        return acc;
    }, {} as Record<string, string | null>);

    return {
        names,
        loading,
        error,
    };
};
