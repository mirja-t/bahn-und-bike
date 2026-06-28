import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { type VelorouteListItem } from "@/components/map/veloroutes/VeloroutesSlice";
import { headers, VITE_API_URL } from "@/config/config";
import { useTrainroutesQuery } from "./useTrainroutesQuery";
import { useSelector } from "react-redux";
import { selectActiveSectionId } from "@/components/map/trainroutes/TrainroutesSlice";
import { useTrainroutesAlongVelorouteSectionQuery } from "./useTrainroutesAlongVelorouteSectionQuery";

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
    const { data: trainroutesData } = useTrainroutesQuery();
    const { data: trainroutesAlongVelorouteData } =
        useTrainroutesAlongVelorouteSectionQuery();
    const trainstops =
        trainroutesAlongVelorouteData?.trainstops ||
        trainroutesData?.trainstops ||
        [];
    const activeTrainrouteId = useSelector(selectActiveSectionId);
    const activeTrainroute = trainroutesData?.currentTrainroutes.find(
        (section) => section.id === activeTrainrouteId,
    );
    const filteredTrainstops = activeTrainroute
        ? activeTrainroute.routestops.map((stop) => stop.station_id)
        : trainstops;
    return useQuery({
        queryKey: ["veloroutes", filteredTrainstops],
        queryFn: () => fetchVeloroutes({ stationIds: filteredTrainstops }),
        enabled: filteredTrainstops.length > 0,
        keepPreviousData: true,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
