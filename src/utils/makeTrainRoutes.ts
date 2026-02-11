import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

export const makeTrainRoutes = (
    stops: ResponseStop[],
    start: string,
    durationLimit: number,
    direct: boolean = true,
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
    function getPathLength(path: string) {
        return path
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

    /**
     * Group stops by trainline and determine the index of the start station for each trainline.
     * This allows us to create routes in both directions (forward and backward) from the start station.
     *
     * {
     *  trainline_id: {
     *      startStopIdx: number; // index of the start station in the stops array for this trainline
     *      stops: ResponseStop[]; // all stops for this trainline
     *  }
     * }
     */
    const trainlineStopsObj = stops.reduce(
        (acc, stop) => {
            if (!acc[stop.trainline_id]) {
                acc[stop.trainline_id] = {
                    startStopIdx: -1,
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

    // Create routes for each trainline in both directions from the start station
    /**
     * [{responseStop, responseStop, ...}, {...}] => [
     */
    const groupedStops: ResponseStop[][] = [];
    for (const trainlineId in trainlineStopsObj) {
        const { startStopIdx, stops } = trainlineStopsObj[trainlineId];
        if (startStopIdx === undefined) continue; // Skip if start station is not found
        if (startStopIdx > 0) {
            groupedStops.push(stops.slice(startStopIdx)); // forward direction
            groupedStops.push(stops.slice(0, startStopIdx + 1).reverse()); // backward direction
        }
    }

    if (!groupedStops.length) return [];

    /**
     * Create routes tree
     */
    const routeTree: {
        route: CurrentTrainroute;
        nextRoutes: (typeof routeTree)[];
    } = {
        route: createNewRoute(groupedStops[0][0]),
        nextRoutes: [],
    };
    for (const group of groupedStops) {
        let currentRoute = routeTree;
        for (const stop of group) {
            // break if duration limit exceeded
            if (currentRoute.route.dur + stop.dur > durationLimit) break;

            // find current route
            const nextRoute = currentRoute.nextRoutes.find(
                (r) => r.route.lastStation.stop_id === stop.destination_id,
            );
            if (nextRoute) {
                currentRoute = nextRoute;
            }
            if (
                stop.destination_id === currentRoute.route.lastStation.stop_id
            ) {
                // Add trainline to existing route if stop is already in route
                if (
                    !currentRoute.route.trainlines.includes(stop.trainline_id)
                ) {
                    currentRoute.route.trainlines.push(stop.trainline_id);
                }
            } else {
                // create new route
                const [x, y] = SvgMapBuilder.getMapPosition(
                    parseFloat(stop.lon),
                    parseFloat(stop.lat),
                    germanyBounds,
                );
                const points = `${currentRoute.route.points}${x},${y} `;
                currentRoute.nextRoutes.push({
                    route: {
                        connection: null,
                        dur: currentRoute.route.dur + stop.dur,
                        trainlines: [stop.trainline_id],
                        firstStation: routeTree.route.firstStation,
                        lastStation: {
                            stop_name: stop.destination_name,
                            stop_id: stop.destination_id,
                            x,
                            y,
                        },
                        stopIds: [
                            ...currentRoute.route.stopIds,
                            stop.destination_id,
                        ],
                        points,
                        pathLength: getPathLength(points),
                    },
                    nextRoutes: [],
                });
                currentRoute =
                    currentRoute.nextRoutes[currentRoute.nextRoutes.length - 1]; // Move to the newly created route
            }
        }
    }

    const routes: CurrentTrainroute[] = [];

    // Breadth traverse route tree to extract routes
    const queue: (typeof routeTree)[] = [routeTree];
    while (queue.length) {
        const current = queue.shift()!;
        if (current.nextRoutes.length === 0) {
            routes.push(current.route);
        } else {
            for (const nextRoute of current.nextRoutes) {
                queue.push(nextRoute);
            }
        }
    }

    return routes;
};
