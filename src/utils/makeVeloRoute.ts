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

export const makeVelorouteLegs = (
    stops: VelorouteStop[],
    maxDistToNextStation: number,
) => {
    const routeLegs = stops.reduce(
        (acc: { leg: VelorouteStop[] }[], stop, idx, arr) => {
            const lastLeg = acc[acc.length - 1];
            if (!lastLeg) {
                // add first leg
                acc.push({ leg: [stop] });
            } else if (
                // build leg on new trainstation
                stop.trainstop !== null &&
                idx !== arr.length - 1 && // the last stop can be a trainstop but should not create a new leg
                stop.distToTrainstation !== undefined &&
                stop.distToTrainstation <= maxDistToNextStation
            ) {
                acc.push({ leg: [stop] });
                lastLeg.leg.push(stop);
            } else {
                lastLeg.leg.push(stop);
            }
            return acc;
        },
        [],
    );
    const routes = routeLegs.map((route, routeIdx, routeArr) => ({
        ...route,
        dist: route.leg
            .slice(0, route.leg.length - 1)
            .reduce((sum, stop) => sum + stop.dist, 0),
        path: route.leg
            .map((stop, idx, arr) => {
                if (routeIdx < routeArr.length - 1 && idx === arr.length - 1)
                    return ""; // last stop does not have a path
                return stop.path;
            })
            .join(" "),
    }));
    return routes;
};

export const makeVeloRoute = (
    stops: VelorouteStop[],
    maxDistToNextStation: number,
    id: string,
    name: string,
): Veloroute => {
    const route = makeVelorouteLegs(stops, maxDistToNextStation);
    return {
        id,
        name,
        len: stops.reduce((sum, stop) => sum + stop.dist, 0),
        route,
    };
};

export const convertVelorouteStops = (
    stops: VeloroutesResponseStop[],
    trainstops: number[],
): VelorouteStop[] => {
    const convertedStops = stops
        .sort((a, b) => a.stop_number - b.stop_number)
        .map((stop) => {
            const copiedStop: VelorouteStop = {
                stop_id: `${stop.veloroute_id}-${stop.stop_number}-${stop.name}`,
                stop_name: stop.station_name || stop.dest_name || "",
                x: addXY(stop).x,
                y: addXY(stop).y,
                lat: parseFloat(stop.lat),
                lon: parseFloat(stop.lon),
                dist: stop.dist,
                path: stop.gcs
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
                    .map(([x, y]) => `${x},${y}`)
                    .join(" "),
                trainstop:
                    stop.trainstop && trainstops.includes(stop.trainstop)
                        ? stop.trainstop
                        : null,
                trainlines: stop.trainlines
                    ? stop.trainlines.split(",").map((line) => line.trim())
                    : [],
            };
            if (copiedStop.trainstop) {
                const stationLat = parseFloat(stop.station_lat ?? "");
                const stationLon = parseFloat(stop.station_lon ?? "");

                if (!isNaN(stationLat) && !isNaN(stationLon)) {
                    copiedStop.distToTrainstation = haversineDistance(
                        parseFloat(stop.lat),
                        parseFloat(stop.lon),
                        stationLat,
                        stationLon,
                    );
                }
            }
            return copiedStop;
        });

    return convertedStops;
};
