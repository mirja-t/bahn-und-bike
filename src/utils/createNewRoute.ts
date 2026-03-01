import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { getPathLengthFromPoints } from "./getPathLength";
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

export function createNewRoute(
    startDest: ResponseStop,
    route?: ResponseStop[],
): CurrentTrainroute {
    const getPoints = (route: ResponseStop[]) =>
        route
            .map(({ lat, lon }) =>
                SvgMapBuilder.getMapPosition(
                    parseFloat(lon),
                    parseFloat(lat),
                    germanyBounds,
                ),
            )
            .map((el) => el.join(","))
            .join(" ") + " ";
    const getDuration = (route: ResponseStop[] | undefined) => {
        if (!route || route.length === 0) return 0;
        const dur = route.reduce((acc, stop) => acc + stop.dur, 0);
        return dur;
    };
    const getMapPosition = (stop: ResponseStop) =>
        SvgMapBuilder.getMapPosition(
            parseFloat(stop.lon),
            parseFloat(stop.lat),
            germanyBounds,
        );
    const trainlines = [
        {
            trainline_id: startDest.trainline_id,
            trainline_name: startDest.name,
        },
    ];
    const stopIds = [startDest.destination_id];
    let svgPathPoints = getPoints([startDest]);
    let lastDest = startDest;
    let name = `${startDest.name}: ${startDest.destination_name}`;

    if (route && route.length > 1) {
        const filteredRoute = route.filter((stop, idx, arr) =>
            // quick fix until we have proper route data without duplicates, filter out stops that have the same destination_id as a previous stop in the route (except for the first stop, which is the startDest)
            arr
                .slice(0, idx)
                .every((s) => s.destination_id !== stop.destination_id),
        );
        lastDest = filteredRoute[filteredRoute.length - 1];
        svgPathPoints = getPoints(filteredRoute);
        name = `${startDest.name}: ${lastDest.destination_name}`;
        filteredRoute.slice(1).forEach((stop) => {
            if (
                // avoid duplicates in case of connections with same trainline_id at the beginning and end of the route
                !trainlines.some(
                    (trainline) => trainline.trainline_id === stop.trainline_id,
                )
            ) {
                trainlines.push({
                    trainline_id: stop.trainline_id,
                    trainline_name: stop.name,
                });
            }
            stopIds.push(stop.destination_id);
        });
    }
    return {
        id: startDest.destination_id,
        name,
        connection: null,
        dur: getDuration(route),
        trainlines: trainlines,
        firstStation: {
            stop_name: removeWords(startDest.destination_name, wordsToRemove),
            stop_id: startDest.destination_id,
            lat: parseFloat(startDest.lat),
            lon: parseFloat(startDest.lon),
            x: getMapPosition(startDest)[0],
            y: getMapPosition(startDest)[1],
        },
        lastStation: {
            stop_name: removeWords(lastDest.destination_name, wordsToRemove),
            stop_id: lastDest.destination_id,
            lat: parseFloat(lastDest.lat),
            lon: parseFloat(lastDest.lon),
            x: getMapPosition(lastDest)[0],
            y: getMapPosition(lastDest)[1],
        },
        stopIds: stopIds,
        points: svgPathPoints,
        pathLength: getPathLengthFromPoints(svgPathPoints),
    };
}
