import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { VelorouteListItem } from "@/components/map/veloroutes/VeloroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";

type QueryParams = {
    stationIds: number[];
};
export type VeloroutesQueryParamsType = QueryParams | null;

const fetchVeloroutes = async (
    queryParams: VeloroutesQueryParamsType,
): Promise<VelorouteListItem[]> => {
    if (!queryParams) throw new Error("Missing query params");
    const { stationIds } = queryParams;
    if (stationIds.length === 0) return [];
    const veloroutes: VelorouteListItem[] = await fetch(
        `${VITE_API_URL}veloroutes`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({ trainstations: stationIds }),
        },
    ).then((res) => {
        if (res.status !== 200) throw new Error("Bad Server Response");
        return res.json();
    });
    return veloroutes;
};

export function useVeloroutesQuery(
    queryParams: VeloroutesQueryParamsType,
): UseQueryResult<VelorouteListItem[]> {
    const stationIds = queryParams?.stationIds;
    return useQuery({
        queryKey: ["veloroutes", stationIds],
        queryFn: () => fetchVeloroutes(queryParams),
        enabled: queryParams !== null && !!stationIds?.length,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
