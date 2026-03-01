import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";

export interface UseFetchBatchReturn<T> {
    assets: T[];
    loading: boolean;
    error: boolean;
}

export const useFetchBatch = <T extends { id: string }>(
    ids: string[],
    assetsEndpoint: string,
): UseFetchBatchReturn<T> => {
    const [assetsMap, setAssetsMap] = useState<Map<string, T>>(new Map());
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
                    // Create hashmap of id -> asset for O(1) lookup
                    const newMap = new Map<string, T>();
                    fetchedAssets.forEach((asset) => {
                        newMap.set(asset.id, asset);
                    });

                    setAssetsMap(newMap);
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

    // Map IDs to assets in original order, filter out missing assets
    const assets = ids
        .map((id) => assetsMap.get(id))
        .filter((asset): asset is T => asset !== undefined);

    return {
        assets,
        loading,
        error,
    };
};
