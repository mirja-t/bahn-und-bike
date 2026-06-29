import type { CurrentTrainroute } from "@/components/map/trainroutes/TrainroutesSlice";

export function getTrainstopsArrayFromRoute(
    connection: CurrentTrainroute,
): number[] {
    const trainstops = [
        ...new Set(connection.routestops.map((stop) => stop.station_id)),
    ];
    return trainstops;
}
