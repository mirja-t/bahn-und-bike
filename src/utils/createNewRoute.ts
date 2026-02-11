import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
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
    lastDest?: ResponseStop,
): CurrentTrainroute {
    lastDest = lastDest || startDest;
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
        points: `${getMapPosition(startDest)[0]},${getMapPosition(startDest)[1]} `,
        pathLength: 0,
    };
}
