import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { VelorouteListItem } from "@/components/map/veloroutes/VeloroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { useTrainroutesQuery } from "./useTrainroutesQuery";

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

export function useVeloroutesQuery(): UseQueryResult<VelorouteListItem[]> {
    const { data } = useTrainroutesQuery();
    const trainstops = data?.trainstops || [];

    return useQuery({
        queryKey: ["veloroutes", trainstops],
        queryFn: () => fetchVeloroutes({ stationIds: trainstops }),
        enabled: trainstops.length > 0,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
