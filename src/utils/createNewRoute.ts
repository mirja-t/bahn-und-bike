import type {
    CurrentTrainroute,
    TrainstopAPIResponse,
} from "../components/map/trainroutes/TrainroutesSlice";
import { getPathLengthFromPoints } from "./getPathLength";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

export function createNewRoute(
    startDest: TrainstopAPIResponse,
    route?: TrainstopAPIResponse[],
): CurrentTrainroute {
    const routeWithCoordinates = route?.map((stop) => {
        const [x, y] = SvgMapBuilder.getMapPosition(
            stop.lon,
            stop.lat,
            germanyBounds,
        );
        return {
            ...stop,
            x,
            y,
        };
    });
    const [x, y] = SvgMapBuilder.getMapPosition(
        startDest.lon,
        startDest.lat,
        germanyBounds,
    );
    const firstStation = {
        ...startDest,
        x,
        y,
    };
    const getPoints = (route: TrainstopAPIResponse[]) =>
        route
            .map(({ lat, lon }) =>
                SvgMapBuilder.getMapPosition(lon, lat, germanyBounds),
            )
            .map((el) => el.join(","))
            .join(" ") + " ";
    const getDuration = (route: TrainstopAPIResponse[] | undefined) => {
        if (!route || route.length === 0) return 0;
        const dur = route.reduce((acc, stop) => acc + stop.dur, 0);
        return dur;
    };
    const getMapPosition = (stop: TrainstopAPIResponse) =>
        SvgMapBuilder.getMapPosition(stop.lon, stop.lat, germanyBounds);
    const trainlines = [
        {
            trainline_id: startDest.trainline_id,
            trainline_name: startDest.name,
        },
    ];
    const stopIds = [startDest.station_id];
    let svgPathPoints = getPoints([startDest]);
    let lastDest = startDest;
    let name = `${startDest.name}: ${startDest.station_name} – ${startDest.station_name}`;
    if (route && route.length > 1) {
        const filteredRoute = route.filter((stop, idx, arr) =>
            // quick fix until we have proper route data without duplicates, filter out stops that have the same destination_id as a previous stop in the route (except for the first stop, which is the startDest)
            arr.slice(0, idx).every((s) => s.station_id !== stop.station_id),
        );
        lastDest = filteredRoute[filteredRoute.length - 1];
        svgPathPoints = getPoints(filteredRoute);
        name = `${startDest.name}: ${startDest.station_name} – ${lastDest.station_name}`;
        filteredRoute.slice(1).forEach((stop) => {
            if (
                // avoid duplicates in case of connections with same trainline_id at the beginning and end of the route
                !trainlines.some(
                    (trainline) => trainline.trainline_id === stop.trainline_id,
                )
            ) {
                if (!stop.trainline_id || !stop.name) {
                    console.warn(
                        "Missing trainline_id or name for stop:",
                        stop,
                    );
                }
                trainlines.push({
                    trainline_id: stop.trainline_id,
                    trainline_name: stop.name,
                });
            }
            stopIds.push(stop.station_id);
        });
    }
    return {
        id: `new_route-${stopIds.join("-")}`,
        name,
        connection: null,
        dur: getDuration(route),
        trainlines: trainlines,
        firstStation,

        lastStation: {
            ...lastDest,
            x: getMapPosition(lastDest)[0],
            y: getMapPosition(lastDest)[1],
        },
        routestops: routeWithCoordinates || [firstStation],
        points: svgPathPoints,
        pathLength: getPathLengthFromPoints(svgPathPoints),
    };
}
