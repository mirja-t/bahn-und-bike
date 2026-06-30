import type { CurrentTrainroutes } from "@/components/map/trainroutes/TrainroutesSlice";

export function getTrainstopsArrayFromRoute(
    connections?: CurrentTrainroutes,
): number[] {
    if (!connections || connections.length === 0) return [];
    const trainstops = [
        ...new Set(
            connections
                .map((connection) =>
                    connection.routestops.map((stop) => stop.station_id),
                )
                .flat(),
        ),
    ];
    return trainstops;
}
