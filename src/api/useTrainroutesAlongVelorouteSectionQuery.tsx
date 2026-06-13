import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type {
    CurrentTrainroute,
    CurrentTrainroutes,
} from "@/components/map/trainroutes/TrainroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { createNewRoute } from "@/utils/createNewRoute";

type QueryParams = {
    startdestination: number;
    startId: number | null;
    endId: number | null;
};
export type TrainroutesAlongVelorouteSectionParamsType = QueryParams | null;

const fetchTrainroutesAlongVelorouteSection = async (
    queryParams: TrainroutesAlongVelorouteSectionParamsType,
): Promise<CurrentTrainroutes> => {
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
    return connections;
};

export function useTrainroutesAlongVelorouteSectionQuery(
    queryParams: TrainroutesAlongVelorouteSectionParamsType,
): UseQueryResult<CurrentTrainroutes> {
    const { startdestination, startId, endId } = queryParams ?? {};
    return useQuery({
        queryKey: [
            "trainroutesAlongVelorouteSection",
            startdestination,
            startId,
            endId,
        ],
        queryFn: () => fetchTrainroutesAlongVelorouteSection(queryParams),
        enabled: queryParams !== null && !!startdestination,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
