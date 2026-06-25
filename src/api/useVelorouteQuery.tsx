import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
    Veloroute,
    VeloroutesResponseStop,
} from "@/components/map/veloroutes/VeloroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { convertVelorouteStops, makeVeloRoute } from "@/utils/makeVeloRoute";

type QueryParams = {
    id: string | null;
    trainstops: number[];
    maxDistToNextStation: number;
};
export type VelorouteQueryParamsType = QueryParams | null;

const fetchVeloroute = async (queryParams: VelorouteQueryParamsType) => {
    if (!queryParams?.id) throw new Error("Missing query params");
    const { id, trainstops, maxDistToNextStation } = queryParams;
    const responseStops: VeloroutesResponseStop[] = await fetch(
        `${VITE_API_URL}veloroute/${id}`,
        { headers },
    ).then((res) => {
        if (res.status !== 200) throw new Error("Bad Server Response");
        return res.json();
    });
    const velorouteStops = convertVelorouteStops(responseStops, trainstops);
    return makeVeloRoute(
        velorouteStops,
        maxDistToNextStation,
        id,
        responseStops[0].name,
    );
};

export function useVelorouteQuery(
    queryParams: VelorouteQueryParamsType,
): UseQueryResult<Veloroute | null> {
    const id = queryParams?.id;
    const trainstops = queryParams?.trainstops;
    const maxDistToNextStation = queryParams?.maxDistToNextStation;
    return useQuery({
        queryKey: ["veloroute", id, trainstops, maxDistToNextStation],
        queryFn: () => (id ? fetchVeloroute(queryParams) : null),
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
