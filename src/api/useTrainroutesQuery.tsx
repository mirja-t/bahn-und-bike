import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import {
    type TrainstopsAPIResponse,
    type CurrentTrainroutes,
    selectIsDirect,
    selectTrainTravelDuration,
    selectStartPos,
} from "@/components/map/trainroutes/TrainroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { makeTrainRoutes } from "@/utils/makeTrainRoutes";
import { useSelector } from "react-redux";

type QueryParams = {
    start: number;
    value: number;
    direct: boolean;
};
export const fetchTrainroutes = async (queryParams: QueryParams) => {
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
    const trainstops = [
        ...new Set(
            Object.values(connections)
                .flat()
                .map((stop) => stop.station_id),
        ),
    ];
    const currentTrainroutes = makeTrainRoutes(connections, start, value * 30);
    return { trainstops, currentTrainroutes };
};

export type TrainroutesQueryData = {
    trainstops: number[];
    currentTrainroutes: CurrentTrainroutes;
};

export function useTrainroutesQuery(): UseQueryResult<TrainroutesQueryData> {
    const start = useSelector(selectStartPos);
    const travelDuration = useSelector(selectTrainTravelDuration);
    const isDirect = useSelector(selectIsDirect);

    return useQuery({
        queryKey: ["trainroutes", start, travelDuration, isDirect],
        queryFn: () =>
            fetchTrainroutes({
                start,
                value: travelDuration,
                direct: isDirect,
            }),
        enabled: start !== null && !!travelDuration && travelDuration > 0,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
