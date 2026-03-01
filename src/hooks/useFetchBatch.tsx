import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";

export interface UseFetchBatchReturn<T> {
    assets: T[];
    loading: boolean;
    error: boolean;
}

export const useFetchBatch = <T,>(
    ids: string[],
    assetsEndpoint: string,
): UseFetchBatchReturn<T> => {
    const [assets, setAssets] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch assetsEndpoint when needed
    useEffect(() => {
        if (!ids.length || !assetsEndpoint) return;

        let isCancelled = false;
        setLoading(true);
        setError(false);

        const fetchAssets = async () => {
            try {
                const validIds = ids.filter((id) => id && id.trim() !== "");
                if (validIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const assetsQuery =
                    `${assetsEndpoint}/ids[]=` + validIds.join("&ids[]=");
                const response = await fetch(`${VITE_API_URL}${assetsQuery}`, {
                    headers: headers,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${assetsEndpoint}`);
                }

                const fetchedAssets: T[] = await response.json();

                if (!isCancelled) {
                    setAssets(fetchedAssets);
                    setLoading(false);
                    setError(false);
                }
            } catch (err) {
                console.error(`Error fetching ${assetsEndpoint}:`, err);
                if (!isCancelled) {
                    setError(true);
                    setLoading(false);
                }
            }
        };
        fetchAssets();

        return () => {
            isCancelled = true;
        };
    }, [ids, assetsEndpoint]);

    return {
        assets,
        loading,
        error,
    };
};
