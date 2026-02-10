import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

export const makeTrainRoutes = (
    stops: ResponseStop[],
    start: string,
    durationLimit: number,
): CurrentTrainroute[] => {
    // to do: consider duration order for reverse direction
    function createNewRoute(startDest: ResponseStop) {
        const [x, y] = SvgMapBuilder.getMapPosition(
            parseFloat(startDest.lon),
            parseFloat(startDest.lat),
            germanyBounds,
        );
        return {
            connection: null,
            dur: 0,
            trainlines: [startDest.trainline_id],
            firstStation: {
                stop_name: startDest.destination_name,
                stop_id: startDest.destination_id,
                x,
                y,
            },
            lastStation: {
                stop_name: startDest.destination_name,
                stop_id: startDest.destination_id,
                x,
                y,
            },
            stopIds: [startDest.destination_id],
            points: `${x},${y} `,
            pathLength: 0,
        };
    }

    const stopsObj = stops.reduce(
        (acc, stop) => {
            if (!acc[stop.trainline_id]) {
                acc[stop.trainline_id] = {
                    startStopIdx: 0,
                    stops: [],
                };
            }
            if (stop.destination_id === start) {
                acc[stop.trainline_id].startStopIdx = stop.stop_number;
            }
            acc[stop.trainline_id].stops.push(stop);
            return acc;
        },
        {} as {
            [key: string]: {
                startStopIdx: number;
                stops: ResponseStop[];
            };
        },
    );

    const groupedStops: ResponseStop[][] = [];

    for (const trainlineId in stopsObj) {
        const { startStopIdx, stops } = stopsObj[trainlineId];
        if (startStopIdx === undefined) continue; // Skip if start station is not found
        if (startStopIdx > 0) {
            groupedStops.push(stops.slice(startStopIdx)); // forward direction
            groupedStops.push(stops.slice(0, startStopIdx + 1).reverse()); // backward direction
        }
    }

    if (!groupedStops.length) return [];

    const routes: CurrentTrainroute[] = [];
    for (const group of groupedStops) {
        let stopIdx = 0;
        for (const stop of group) {
            // Add trainline to existing route if stop is already in route
            const [x, y] = SvgMapBuilder.getMapPosition(
                parseFloat(stop.lon),
                parseFloat(stop.lat),
                germanyBounds,
            );
            if (stopIdx === 1) {
                // Add new route
                if (group[0].dur + stop.dur > durationLimit) continue;

                const currentRoute = createNewRoute(group[0]);
                currentRoute.stopIds.push(stop.destination_id);
                currentRoute.lastStation = {
                    stop_name: stop.destination_name,
                    stop_id: stop.destination_id,
                    x,
                    y,
                };
                currentRoute.dur += stop.dur;
                currentRoute.points += `${x},${y} `;
                routes.push(currentRoute);
            } else if (stopIdx > 1) {
                // Add to existing route if within duration limit
                const currentRoute = routes[routes.length - 1];
                if (currentRoute.dur + stop.dur > durationLimit) break;
                currentRoute.stopIds.push(stop.destination_id);
                currentRoute.lastStation = {
                    stop_name: stop.destination_name,
                    stop_id: stop.destination_id,
                    x,
                    y,
                };
                currentRoute.dur += stop.dur;
                currentRoute.points += `${x},${y} `;
                currentRoute.pathLength = currentRoute.points
                    .split(" ")
                    .slice(0, -1)
                    .map((point) => point.split(",").map(Number))

                    .map((el, idx, arr) => {
                        const prev = idx > 0 ? arr[idx - 1] : el;
                        const a = Math.abs(prev[0] - el[0]);
                        const b = Math.abs(prev[1] - el[1]);
                        return Math.sqrt(a ** 2 + b ** 2);
                    })
                    .reduce((acc: number, n: number) => acc + n, 0);
            }
            stopIdx++;
        }
    }
    return routes;
};
