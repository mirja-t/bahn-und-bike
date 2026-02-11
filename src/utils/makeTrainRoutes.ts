import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { createNewRoute } from "./createNewRoute";
import { getPathLengthFromPoints } from "./getPathLength";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

type TrainlineStopsObj = {
    [key: string]: {
        startStopIdx: number;
        stops: ResponseStop[];
    };
};

type RouteNode = {
    route: CurrentTrainroute;
    nextRoutes: RouteNode[];
};

export const makeTrainRoutes = (
    stops: ResponseStop[],
    start: string,
    durationLimit: number,
    direct: boolean = true,
): CurrentTrainroute[] => {
    function createNestedStopsGroups(trainlineStopsObj: TrainlineStopsObj) {
        const groupedDirectStops: ResponseStop[][] = [];
        for (const trainlineId in trainlineStopsObj) {
            const { startStopIdx, stops } = trainlineStopsObj[trainlineId];
            if (startStopIdx === undefined) continue; // Skip if start station is not found
            if (startStopIdx >= 0) {
                groupedDirectStops.push(stops.slice(startStopIdx)); // forward direction

                // backward direction - to do: consider duration order for reverse direction
                const reversedStops = stops
                    .slice(0, startStopIdx + 1)
                    .reverse()
                    .map((stop, idx, arr) => ({
                        ...stop,
                        dur: idx === 0 ? 0 : arr[idx - 1].dur, // take duration from prev stop
                    }));
                groupedDirectStops.push(reversedStops); // backward direction
            }
        }
        return groupedDirectStops;
    }
    function createTrainlineStopsObj(
        stops: ResponseStop[],
        start: string,
    ): TrainlineStopsObj {
        return stops.reduce((acc, stop) => {
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
        }, {} as TrainlineStopsObj);
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
    const trainlineStopsObj = createTrainlineStopsObj(stops, start);

    // Create routes for each trainline in both directions from the start station
    /**
     * [{responseStop, responseStop, ...}, {...}] => [
     */
    const groupedDirectStops = createNestedStopsGroups(trainlineStopsObj);

    if (!groupedDirectStops.length) return [];

    /**
     * If indirect train routes are enabled
     */
    const groupedConnectingTrainlineStops = direct
        ? []
        : Object.values(trainlineStopsObj).filter(
              ({ startStopIdx }) => startStopIdx === -1,
          );

    /**
     * Create routes tree
     */
    const routeTree: RouteNode = {
        route: createNewRoute(groupedDirectStops[0][0]),
        nextRoutes: [],
    };
    for (const group of groupedDirectStops) {
        let currentRoute = routeTree;
        for (const stop of group) {
            // break if duration limit exceeded
            if (currentRoute.route.dur + stop.dur > durationLimit) break;
            // Add connecting trainline if indirect routes are enabled
            if (!direct) {
                // Find connecting trainlines that pass through the same station
                const connectingTrainlines = groupedConnectingTrainlineStops
                    .filter((trainline) =>
                        trainline.stops.some(
                            (s) => s.destination_id === stop.destination_id,
                        ),
                    )
                    .map((trainline) => trainline.stops);
                const connectingTrainlineRoutes = connectingTrainlines.map(
                    (trainlineStops) =>
                        createTrainlineStopsObj(
                            trainlineStops,
                            stop.destination_id,
                        ),
                );
                const connectingTrainlineRoutesGroups =
                    connectingTrainlineRoutes
                        .map(createNestedStopsGroups)
                        .flat();
                // Add connecting trainline routes to the current route
                for (const connectingGroup of connectingTrainlineRoutesGroups) {
                    const connectingRoute = {
                        route: {
                            connection: {
                                stop_name: stop.destination_name,
                                initial_trains: currentRoute.route.trainlines,
                                connecting_train:
                                    connectingGroup[0].trainline_id,
                            },
                            dur: currentRoute.route.dur,
                            trainlines: [...currentRoute.route.trainlines],
                            firstStation: {
                                ...currentRoute.route.firstStation,
                            },
                            lastStation: {
                                ...currentRoute.route.lastStation,
                            },
                            stopIds: [...currentRoute.route.stopIds],
                            points: currentRoute.route.points,
                            pathLength: currentRoute.route.pathLength,
                        },
                        nextRoutes: [],
                    };
                    for (const connectingStop of connectingGroup) {
                        if (
                            connectingRoute.route.dur + connectingStop.dur >
                            durationLimit
                        ) {
                            break;
                        }
                        // build connecting route
                        const [x, y] = SvgMapBuilder.getMapPosition(
                            parseFloat(connectingStop.lon),
                            parseFloat(connectingStop.lat),
                            germanyBounds,
                        );
                        connectingRoute.route.dur += connectingStop.dur;
                        connectingRoute.route.trainlines = [
                            ...new Set([
                                ...connectingRoute.route.trainlines,
                                connectingStop.trainline_id,
                            ]),
                        ];
                        connectingRoute.route.lastStation = {
                            stop_name: connectingStop.destination_name,
                            stop_id: connectingStop.destination_id,
                            lat: parseFloat(connectingStop.lat),
                            lon: parseFloat(connectingStop.lon),
                            x,
                            y,
                        };
                        connectingRoute.route.stopIds.push(
                            connectingStop.destination_id,
                        );
                        connectingRoute.route.points += `${x},${y} `;
                        connectingRoute.route.pathLength =
                            getPathLengthFromPoints(
                                connectingRoute.route.points,
                            );
                    }
                    if (
                        connectingRoute.route.lastStation.stop_name !==
                        stop.destination_name
                    ) {
                        currentRoute.nextRoutes.push(connectingRoute);
                    }
                }
            }
            // find current route
            const nextRoute = currentRoute.nextRoutes.find(
                (r) => r.route.lastStation.stop_id === stop.destination_id,
            );
            if (nextRoute) {
                currentRoute = nextRoute;
            }
            // if stop is already in route, add trainline to existing route
            if (
                stop.destination_id === currentRoute.route.lastStation.stop_id
            ) {
                // Add trainline to existing route
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
                            lat: parseFloat(stop.lat),
                            lon: parseFloat(stop.lon),
                            x,
                            y,
                        },
                        stopIds: [
                            ...currentRoute.route.stopIds,
                            stop.destination_id,
                        ],
                        points,
                        pathLength: getPathLengthFromPoints(points),
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
    const queue: RouteNode[] = [routeTree];
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
