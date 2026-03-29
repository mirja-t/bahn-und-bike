import { useEffect, useState } from "react";
import { headers, VITE_API_URL } from "../config/config";

export interface UseFetchBatchReturn<T> {
    assets: T[];
    loading: boolean;
    error: boolean;
}

export const useFetchBatch = <T extends { id: string | number }>(
    ids: (string | number)[],
    assetsEndpoint: string,
    method: "POST" | "GET" = "GET",
): UseFetchBatchReturn<T> => {
    const [assetsMap, setAssetsMap] = useState<Map<string, T>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Fetch assetsEndpoint when needed
    useEffect(() => {
        if (!ids.length || !assetsEndpoint || !method) return;

        let isCancelled = false;
        setLoading(true);
        setError(false);

        const fetchAssets = async () => {
            try {
                const validIds = ids.filter((id) => {
                    if (typeof id === "number") {
                        return !isNaN(id);
                    }
                    return id && id.trim() !== "";
                });
                if (validIds.length === 0) {
                    setLoading(false);
                    return;
                }
                let assetQuery = `${assetsEndpoint}`;
                const config: {
                    method?: typeof method;
                    headers: typeof headers;
                    body?: string;
                } = {
                    headers,
                };
                if (method === "GET") {
                    assetQuery += `?ids[]=${validIds.join("&ids[]=")}`;
                }
                if (method === "POST") {
                    config.method = "POST";
                    config.body = JSON.stringify({ ids: validIds });
                }

                const response = await fetch(
                    `${VITE_API_URL}${assetQuery}`,
                    config,
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${assetsEndpoint}`);
                }

                const fetchedAssets: T[] = await response.json();

                if (!isCancelled) {
                    // Create hashmap of id -> asset for O(1) lookup
                    const newMap = new Map<string, T>();
                    fetchedAssets.forEach((asset) => {
                        newMap.set(asset.id.toString(), asset);
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
    }, [ids, assetsEndpoint, method]);

    // Map IDs to assets in original order, filter out missing assets
    const assets = ids
        .map((id) => assetsMap.get(id.toString()))
        .filter((asset): asset is T => asset !== undefined);

    return {
        assets,
        loading,
        error,
    };
};
