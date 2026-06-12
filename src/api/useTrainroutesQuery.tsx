import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
    TrainstopsAPIResponse,
    CurrentTrainroutes,
} from "@/components/map/trainroutes/TrainroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { makeTrainRoutes } from "@/utils/makeTrainRoutes";
import { useRef } from "react";

type QueryParams = {
    start: number;
    value: number;
    direct: boolean;
};
export type QueryParamsType = QueryParams | null;
const fetchTrainroutes = async (queryParams: QueryParamsType) => {
    const start = queryParams?.start;
    const value = queryParams?.value;
    const direct = queryParams?.direct;
    if (!start || !value) throw new Error("Missing query params");
    const connectionsQuery = direct
        ? `trainstops/${start}`
        : `connections/${start}`;
    const connections: TrainstopsAPIResponse = await fetch(
        `${VITE_API_URL}${connectionsQuery}`,
        { headers },
    ).then((res) => {
        if (res.status !== 200) throw new Error("Bad Server Response");
        return res.json();
    });
    // used to create veloroute sections
    const trainstops = Object.values(connections)
        .flat()
        .map((stop) => stop.station_id);
    const currentTrainroutes = makeTrainRoutes(connections, start, value * 30);
    return { trainstops, currentTrainroutes };
};

export type TrainroutesQueryData = {
    trainstops: number[];
    currentTrainroutes: CurrentTrainroutes;
};

export function useTrainroutesQuery(
    queryParams: QueryParamsType,
): UseQueryResult<TrainroutesQueryData> {
    const lastValidParamsRef = useRef<QueryParamsType | null>(null);

    if (queryParams?.value && queryParams.value > 0) {
        lastValidParamsRef.current = queryParams;
    }
    const params = lastValidParamsRef.current;
    const start = params?.start;
    const value = params?.value;
    const direct = params?.direct;
    return useQuery({
        queryKey: ["trainroutes", start, value, direct],
        queryFn: () => fetchTrainroutes(params),
        enabled: params !== null && !!value && value > 0,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
