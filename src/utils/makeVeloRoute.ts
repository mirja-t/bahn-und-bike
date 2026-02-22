import type {
    ResponseStop,
    Veloroute,
    VelorouteStop,
} from "../components/map/veloroutes/VeloroutesSlice";
import { getRoutePath } from "./getRoutePath";
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
    name: string,
    trainlines: string[] | null,
): Veloroute => {
    stops.sort((a, b) => a.stop_number - b.stop_number);
    const velorouteStops = convertVelorouteStops(stops);
    const legs = velorouteStops.reduce(
        (acc: { dist: number; leg: VelorouteStop[] }[], stop, idx, arr) => {
            const lastLeg = acc[acc.length - 1];
            if (!lastLeg) {
                acc.push({ dist: 0, leg: [stop] });
            } else if (
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
    return {
        id: stops[0].veloroute_id,
        name,
        len: stops.reduce((acc, stop) => acc + stop.dist, 0),
        path: getRoutePath(
            legs.map(({ leg }) => leg.map(({ x, y }) => ({ x, y })).flat()),
        ),
        route: legs,
    };
};

export const convertVelorouteStops = (
    stops: ResponseStop[],
): (VelorouteStop & { dist: number })[] => {
    return stops.map((stop) => {
        const copiedStop: VelorouteStop & { dist: number } = {
            stop_id: stop.id,
            stop_name: removeWords(stop.dest_name, wordsToRemove),
            x: addXY(stop).x,
            y: addXY(stop).y,
            dist: stop.dist,
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
