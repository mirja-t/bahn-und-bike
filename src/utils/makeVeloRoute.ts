import type {
    VeloroutesResponseStop,
    Veloroute,
    VelorouteStop,
} from "../components/map/veloroutes/VeloroutesSlice";
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
    stops: VeloroutesResponseStop[],
    trainstops: number[],
): Veloroute => {
    stops.sort((a, b) => a.stop_number - b.stop_number);
    const velorouteStops = convertVelorouteStops(stops);
    const legs = velorouteStops.reduce(
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
                // build leg
                !!stop.trainstop &&
                trainstops.includes(stop.trainstop) &&
                idx !== arr.length - 1
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
        id: stops[0].veloroute_id,
        name: stops[0].name,
        len: stops.reduce((sum, stop) => sum + stop.dist, 0),
        path: polyline,
        route: legs,
    };
};

export const convertVelorouteStops = (
    stops: VeloroutesResponseStop[],
): (VelorouteStop & { dist: number; gcs: string })[] => {
    const convertedStops = stops.map((stop) => {
        const copiedStop: VelorouteStop & { dist: number; gcs: string } = {
            stop_id: `${stop.veloroute_id}-${stop.stop_number}-${stop.name}`,
            stop_name: stop.station_name || stop.dest_name || "",
            x: addXY(stop).x,
            y: addXY(stop).y,
            dist: stop.dist,
            gcs: stop.gcs,
            trainstop: stop.trainstop,
        };
        if (stop.trainlines) {
            copiedStop.trainlines = stop.trainlines.split(",");
        }
        if (stop.trainstop) {
            copiedStop.trainstop = stop.trainstop;
        }
        return copiedStop;
    });
    return convertedStops;
};
