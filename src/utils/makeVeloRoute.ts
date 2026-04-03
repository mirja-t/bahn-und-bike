import type {
    VeloroutesResponseStop,
    Veloroute,
    VelorouteStop,
} from "../components/map/veloroutes/VeloroutesSlice";
import { haversineDistance } from "./haversineDistance";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

const addXY = (stop: VeloroutesResponseStop) => {
    const [x, y] = SvgMapBuilder.getMapPosition(
        parseFloat(stop.lon),
        parseFloat(stop.lat),
        germanyBounds,
    );
    return {
        ...stop,
        x,
        y,
    };
};

export const makeVeloRoute = (
    stops: (VelorouteStop & { dist: number; gcs: string })[],
    trainstops: number[],
    maxDistToNextStation: number,
    id: string,
    name: string,
): Veloroute => {
    const legs = stops.reduce(
        (
            acc: { dist: number; leg: (VelorouteStop & { gcs: string })[] }[],
            stop,
            idx,
            arr,
        ) => {
            const lastLeg = acc[acc.length - 1];
            if (!lastLeg) {
                // add first leg
                acc.push({ dist: 0, leg: [stop] });
            } else if (
                // build leg on new trainstation
                stop.trainstop !== null &&
                trainstops.includes(stop.trainstop) &&
                idx !== arr.length - 1 && // the last stop can be a trainstop but should not create a new leg
                stop.distToTrainstation !== undefined &&
                stop.distToTrainstation <= maxDistToNextStation
            ) {
                acc.push({ dist: 0, leg: [stop] });
                lastLeg.leg.push(stop);
                lastLeg.dist =
                    Math.round((lastLeg.dist + stop.dist) * 100) / 100;
            } else {
                lastLeg.leg.push(stop);
                lastLeg.dist =
                    Math.round((lastLeg.dist + stop.dist) * 100) / 100;
            }
            return acc;
        },
        [],
    );
    const polyline = legs.map(
        ({ leg }) =>
            leg
                .map(({ gcs }) => {
                    const positions = gcs
                        .split(" ")
                        .map((gcs) => {
                            const [lat, lon] = gcs.split(",").map(parseFloat);
                            const [x, y] = SvgMapBuilder.getMapPosition(
                                lon,
                                lat,
                                germanyBounds,
                            );
                            return [x, y];
                        })
                        .filter(([x, y]) => !isNaN(x) && !isNaN(y))
                        .map(([x, y]) => `${x},${y}`);
                    return positions.join(" ");
                })
                .join(" "),
        // .map(({ x, y }) => `${x},${y}`)
        // .join(" "),
    );
    return {
        id,
        name,
        len: stops.reduce((sum, stop) => sum + stop.dist, 0),
        path: polyline,
        route: legs,
    };
};

export const convertVelorouteStops = (
    stops: VeloroutesResponseStop[],
): (VelorouteStop & { dist: number; gcs: string })[] => {
    const convertedStops = stops
        .sort((a, b) => a.stop_number - b.stop_number)
        .map((stop) => {
            const copiedStop: VelorouteStop & { dist: number; gcs: string } = {
                stop_id: `${stop.veloroute_id}-${stop.stop_number}-${stop.name}`,
                stop_name: stop.station_name || stop.dest_name || "",
                x: addXY(stop).x,
                y: addXY(stop).y,
                lat: parseFloat(stop.lat),
                lon: parseFloat(stop.lon),
                dist: stop.dist,
                gcs: stop.gcs,
                trainstop: stop.trainstop,
            };
            // add distance to trainstation if trainstop exists
            if (stop.trainstop) {
                copiedStop.distToTrainstation = haversineDistance(
                    parseFloat(stop.lat),
                    parseFloat(stop.lon),
                    parseFloat(stop.station_lat || "0"),
                    parseFloat(stop.station_lon || "0"),
                );
            }
            return copiedStop;
        });

    return convertedStops;
};
