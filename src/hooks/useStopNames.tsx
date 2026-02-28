import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";
import type { ActiveDestination } from "../components/destinationDetails/DestinationDetailsSlice";

export interface UseStopNamesReturn {
    names: (string | null)[];
    loading: boolean;
    error: boolean;
}

export const useStopNames = (ids: string[]): UseStopNamesReturn => {
    const [destinations, setDestinations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch destinations when needed
    useEffect(() => {
        let isCancelled = false;
        setLoading(true);
        setError(false);

        const fetchDestinations = async () => {
            try {
                const destinationQuery =
                    "destinations/ids[]=" + ids.join("&ids[]=");
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
                    setDestinations(
                        fetchedDestinations.map((dest) => dest.name),
                    );
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

    return {
        names: destinations,
        loading,
        error,
    };
};
