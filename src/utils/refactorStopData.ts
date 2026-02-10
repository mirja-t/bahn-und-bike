import type {
    ConnectionStop,
    ConnectionStopRefactored,
} from "../components/map/trainroutes/TrainroutesSlice";
import { germanyBounds, SvgMapBuilder } from "./svgMap";
import { removeWords } from "./utils";

export const refactorStopData = (
    stop: ConnectionStop,
): ConnectionStopRefactored => {
    const wordsToRemove = [
        "Bahnhof",
        "Hbf",
        "Hauptbahnhof",
        "Bhf",
        "S-Bahn",
        "Busbahnhof",
    ];
    const [x, y] = SvgMapBuilder.getMapPosition(
        parseFloat(stop.lon),
        parseFloat(stop.lat),
        germanyBounds,
    );
    const connectionStop: ConnectionStopRefactored = {
        stop_id: stop.destination_id,
        stop_name: removeWords(stop.destination_name, wordsToRemove),
        stop_number: stop.stop_number,
        lat: parseFloat(stop.lat),
        lon: parseFloat(stop.lon),
        x: x,
        y: y,
        trainline_id: stop.trainline_id,
    };
    try {
        for (const key in connectionStop) {
            if (
                connectionStop[key as keyof ConnectionStopRefactored] ===
                undefined
            ) {
                throw new Error(`Missing value for key ${key} in stop ${stop}`);
            }
        }
        // if (stop.trainstops) trainstops = stop.trainstops;
        // if (stop.veloroute_id) veloroute_id = stop.veloroute_id;
        // if (stop.dur) dur = parseInt(stop.dur);
        // if (stop.len) len = parseInt(stop.len);
    } catch (e) {
        console.error("Error refactoring stop data: ", e);
    }
    return connectionStop;
};
