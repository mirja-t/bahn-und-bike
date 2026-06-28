import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import {
    selectStartPos,
    type CurrentTrainroute,
    type CurrentTrainroutes,
} from "@/components/map/trainroutes/TrainroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { createNewRoute } from "@/utils/createNewRoute";
import { useSelector } from "react-redux";
import { useVelorouteQuery } from "./useVelorouteQuery";
import { selectActiveVelorouteSectionIdx } from "@/components/map/veloroutes/VeloroutesSlice";

type QueryParams = {
    startdestination: number;
    startId: number | null;
    endId: number | null;
};

const fetchTrainroutesAlongVelorouteSection = async (
    queryParams: QueryParams,
): Promise<{ connections: CurrentTrainroutes; trainstops: number[] }> => {
    if (!queryParams?.startdestination) throw new Error("Missing query params");
    const { startdestination, startId, endId } = queryParams;
    const fetchConnection = async (id: number): Promise<CurrentTrainroute> => {
        const connection = await fetch(
            `${VITE_API_URL}connection/${startdestination}&${id}`,
            { headers },
        ).then((res) => {
            if (res.status !== 200) throw new Error("Bad Server Response");
            return res.json();
        });
        const reversedConnection = [...connection].reverse();
        return createNewRoute(reversedConnection[0], reversedConnection);
    };
    const connections: CurrentTrainroutes = [];
    const seenIds = new Set<number>();
    for (const id of [startId, endId]) {
        if (id === null || seenIds.has(id)) continue;
        connections.push(await fetchConnection(id));
        seenIds.add(id);
    }
    const trainstops = [
        ...new Set(
            Object.values(connections)
                .flat()
                .map((connection) =>
                    connection.routestops.map((stop) => stop.station_id),
                )
                .flat(),
        ),
    ];
    return { connections, trainstops };
};

export function useTrainroutesAlongVelorouteSectionQuery(): UseQueryResult<{
    connections: CurrentTrainroutes;
    trainstops: number[];
}> {
    const startPos = useSelector(selectStartPos);
    const { data: activeVelorouteData } = useVelorouteQuery();
    const activeVelorouteSection = useSelector(selectActiveVelorouteSectionIdx);
    const startId =
        activeVelorouteData && activeVelorouteSection !== null
            ? activeVelorouteData.route[activeVelorouteSection].leg.at(0)
                  ?.trainstop
            : null;
    const endId =
        activeVelorouteData && activeVelorouteSection !== null
            ? activeVelorouteData.route[activeVelorouteSection].leg.at(-1)
                  ?.trainstop
            : null;
    return useQuery({
        queryKey: [
            "trainroutesAlongVelorouteSection",
            startPos,
            startId,
            endId,
        ],
        queryFn: () =>
            fetchTrainroutesAlongVelorouteSection({
                startdestination: startPos,
                startId: startId || null,
                endId: endId || null,
            }),
        enabled: !!startPos && activeVelorouteSection !== null,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
