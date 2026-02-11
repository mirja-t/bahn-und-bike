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
    const svgPathPoints = getPoints(route || [startDest]);
    const lastDest = route ? route[route.length - 1] : startDest;
    const getMapPosition = (stop: ResponseStop) =>
        SvgMapBuilder.getMapPosition(
            parseFloat(stop.lon),
            parseFloat(stop.lat),
            germanyBounds,
        );
    return {
        connection: null,
        dur: 0,
        trainlines: [startDest.trainline_id],
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
        stopIds: [startDest.destination_id],
        points: svgPathPoints,
        pathLength: getPathLengthFromPoints(svgPathPoints),
    };
}
