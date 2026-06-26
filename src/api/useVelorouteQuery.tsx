import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import {
    selectActiveVelorouteId,
    selectMaxDistToNextStation,
    type Veloroute,
    type VeloroutesResponseStop,
} from "@/components/map/veloroutes/VeloroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { convertVelorouteStops, makeVeloRoute } from "@/utils/makeVeloRoute";
import { useSelector } from "react-redux";
import { selectActiveSectionId } from "@/components/map/trainroutes/TrainroutesSlice";
import { useTrainroutesQuery } from "./useTrainroutesQuery";

type QueryParams = {
    id: string | null;
    trainstops: number[];
    maxDistToNextStation: number;
};

const fetchVeloroute = async (queryParams: QueryParams) => {
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

export function useVelorouteQuery(): UseQueryResult<Veloroute | null> {
    const id = useSelector(selectActiveVelorouteId);
    const maxDistToNextStation = useSelector(selectMaxDistToNextStation);
    const activeTrainSectionId = useSelector(selectActiveSectionId);
    const { data: trainroutesData } = useTrainroutesQuery();
    const currentTrainroutes = trainroutesData?.currentTrainroutes || [];
    const activeTrainSection = currentTrainroutes.find(
        (section) => section.id === activeTrainSectionId,
    );
    const activeTrainstops =
        activeTrainSection?.routestops.map((stop) => stop.station_id) || [];
    return useQuery({
        queryKey: ["veloroute", id, activeTrainstops, maxDistToNextStation],
        queryFn: () =>
            id
                ? fetchVeloroute({
                      id,
                      trainstops: activeTrainstops,
                      maxDistToNextStation,
                  })
                : null,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
