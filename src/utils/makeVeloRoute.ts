import type {
    ResponseStop,
    Veloroute,
    VelorouteStop,
} from "../components/map/veloroutes/VeloroutesSlice";
import { germanyBounds, SvgMapBuilder } from "./svgMap";
import { removeWords } from "./utils";

const wordsToRemove = [
    "Bahnhof",
    "Hbf",
    "Hauptbahnhof",
    "Bhf",
    "S-Bahn",
    "Busbahnhof",
];

const addXY = (stop: ResponseStop) => {
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
    stops: ResponseStop[],
    trainlines: string[] | null,
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
                stop.trainlines?.some((trainline) =>
                    !trainlines ? true : trainlines.includes(trainline),
                ) &&
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
    const polyline = legs.map(({ leg }) =>
        leg
            .map(({ gcs }) => {
                const postitions = gcs
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
                return postitions.join(" ");
            })
            .join(" "),
    );
    return {
        id: stops[0].veloroute_id,
        name: stops[0].name,
        len: 0, //stops.reduce((acc, stop) => acc + stop.dist, 0),
        path: polyline,
        route: legs,
    };
};

export const convertVelorouteStops = (
    stops: ResponseStop[],
): (VelorouteStop & { dist: number; gcs: string })[] => {
    return stops.map((stop) => {
        const copiedStop: VelorouteStop & { dist: number; gcs: string } = {
            stop_id: stop.id,
            stop_name: removeWords(stop.dest_name, wordsToRemove),
            x: addXY(stop).x,
            y: addXY(stop).y,
            dist: 0, //stop.dist,
            gcs: stop.gcs,
        };
        if (stop.trainlines) {
            copiedStop.trainlines = stop.trainlines.split(",");
        }
        if (stop.trainstop) {
            copiedStop.trainstop = stop.trainstop;
        }
        return copiedStop;
    });
};
