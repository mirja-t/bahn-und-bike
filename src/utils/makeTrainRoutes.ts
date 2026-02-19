import type {
    CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { createNewRoute } from "./createNewRoute";
import { getPathLengthFromPoints } from "./getPathLength";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

type Trainline = {
    trainline_id: string;
    startStopIdx: number;
    stops: ResponseStop[];
};

type RouteNode = {
    route: CurrentTrainroute;
    nextRoutes: RouteNode[];
};

const fallbackRouteNode: RouteNode = {
    route: createNewRoute({
        name: "",
        lat: "0",
        lon: "0",
        destination_id: "",
        destination_name: "",
        dur: 0,
        stop_number: 0,
        trainline_id: "",
    }),
    nextRoutes: [],
};

export const makeTrainRoutes = (
    stops: ResponseStop[],
    start: string,
    durationLimit: number,
    direct: boolean = true,
): CurrentTrainroute[] => {
    function buildTree(
        groupedStops: ResponseStop[][],
        startNode: RouteNode,
        connection: CurrentTrainroute["connection"] | null = null,
    ) {
        while (groupedStops.length) {
            const currentGroup = groupedStops.shift() || [];
            let currentRoute = startNode;
            for (const stop of currentGroup) {
                // break if duration limit exceeded
                if (currentRoute.route.dur + stop.dur > durationLimit) break;

                // find current route
                const nextRoute = currentRoute.nextRoutes.find(
                    (r) => r.route.lastStation.stop_id === stop.destination_id,
                );
                if (nextRoute) {
                    currentRoute = nextRoute;
                }
                // if stop is already in route, add trainline to existing route
                if (
                    stop.destination_id ===
                    currentRoute.route.lastStation.stop_id
                ) {
                    // Add trainline to connecting route
                    if (
                        connection &&
                        !currentRoute.route.connection?.connecting_trains.includes(
                            stop.trainline_id,
                        )
                    ) {
                        currentRoute.route.connection?.connecting_trains.push(
                            stop.trainline_id,
                        );
                        currentRoute.route.name = `${currentRoute.route.trainlines.join(", ")} + ${connection.connecting_trains.join(", ")}: ${currentRoute.route.lastStation.stop_name}`;
                    }
                    // Add trainline to existing route
                    else if (
                        !currentRoute.route.trainlines.includes(
                            stop.trainline_id,
                        )
                    ) {
                        currentRoute.route.trainlines.push(stop.trainline_id);
                        currentRoute.route.name = `${currentRoute.route.trainlines.join(", ")}: ${currentRoute.route.lastStation.stop_name}`;
                    }
                } else {
                    // create new route
                    const [x, y] = SvgMapBuilder.getMapPosition(
                        parseFloat(stop.lon),
                        parseFloat(stop.lat),
                        germanyBounds,
                    );
                    const points = `${currentRoute.route.points}${x},${y} `;
                    const stopIds = [
                        ...currentRoute.route.stopIds,
                        stop.destination_id,
                    ];
                    let name = `${stop.trainline_id}: ${stop.destination_name}`;
                    if (connection) {
                        name = `${stop.trainline_id} + ${connection.connecting_trains.join(", ")}: ${stop.destination_name}`;
                    }
                    currentRoute.nextRoutes.push({
                        route: {
                            connection,
                            id: stopIds.join("-"),
                            name,
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
                            stopIds,
                            points,
                            pathLength: getPathLengthFromPoints(points),
                        },
                        nextRoutes: [],
                    });
                    currentRoute =
                        currentRoute.nextRoutes[
                            currentRoute.nextRoutes.length - 1
                        ]; // Move to the newly created route
                }
            }
        }
    }
    function createNestedStopsGroups(trainlineStopsArr: Trainline) {
        const groupedDirectStops: ResponseStop[][] = [];
        const { startStopIdx, stops: stopsRef } = trainlineStopsArr; // Use this trainline's stops and start index to build forward and backward stop groups
        const stops = structuredClone(stopsRef); // Create a mutable copy of the stops array for this trainline
        if (startStopIdx >= 0) {
            const forwardRoute = stops.slice(startStopIdx); // forward direction
            groupedDirectStops.push(
                forwardRoute.map((stop, idx) => ({
                    ...stop,
                    stop_number: idx,
                })),
            ); // forward direction

            // backward direction - to do: consider duration order for reverse direction
            const reversedStops = stops
                .slice(0, startStopIdx + 1)
                .reverse()
                .map((stop, idx, arr) => ({
                    ...stop,
                    dur: idx === 0 ? 0 : arr[idx - 1].dur, // take duration from prev stop
                    stop_number: idx,
                }));
            groupedDirectStops.push(reversedStops); // backward direction
        }
        return groupedDirectStops.filter((group) => group.length > 1); // Filter out groups that don't have any stops beyond the start station
    }
    function createTrainlineStopsArr(
        stops: ResponseStop[],
        start: string,
    ): Trainline[] {
        const trainlineObj = stops.reduce(
            (acc, stop) => {
                if (!acc[stop.trainline_id]) {
                    acc[stop.trainline_id] = {
                        trainline_id: stop.trainline_id,
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
            {} as { [key: ResponseStop["trainline_id"]]: Trainline },
        );

        return Object.values(trainlineObj);
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
    const trainlinesArr = createTrainlineStopsArr(stops, start);
    const trainlinesWithStart = trainlinesArr.filter(
        (line) => line.startStopIdx >= 0,
    );
    const trainlinesWithStartStopsArr = trainlinesWithStart
        .map(createNestedStopsGroups)
        .flat();
    if (trainlinesWithStartStopsArr.length === 0) {
        console.warn("No trainlines found for the given start station.");
        return [];
    }
    /**
     * Create routes tree
     */
    const routeTree: RouteNode = {
        route: createNewRoute(trainlinesWithStartStopsArr[0][0]), // Initialize with the start station of the first trainline (arbitrary choice, as all trainlines should have the same start station)
        nextRoutes: [],
    };

    buildTree(trainlinesWithStartStopsArr, routeTree);

    if (!direct) {
        const trainlinesWithoutStartDest = trainlinesArr.filter(
            (line) => line.startStopIdx < 0,
        );
        while (trainlinesWithoutStartDest.length > 0) {
            const trainlineToAdd = trainlinesWithoutStartDest.shift() || {
                stops: [],
                trainline_id: "",
                startStopIdx: -1,
            };
            const queue: RouteNode[] = [routeTree];
            while (queue.length) {
                const current = queue.shift() || fallbackRouteNode;
                const isConnected = trainlineToAdd.stops.some(
                    (stop) =>
                        stop.destination_id ===
                        current.route.lastStation.stop_id,
                );
                if (isConnected) {
                    trainlineToAdd.startStopIdx =
                        trainlineToAdd.stops.findIndex(
                            (stop) =>
                                stop.destination_id ===
                                current.route.lastStation.stop_id,
                        );
                    const connectedTrips = [trainlineToAdd]
                        .map(createNestedStopsGroups)
                        .flat();
                    connectedTrips.forEach((connectedTrip) => {
                        const connection = {
                            connecting_trains: [connectedTrip[0].trainline_id],
                            initial_trains: current.route.trainlines,
                            stop_name: current.route.lastStation.stop_name,
                        };
                        buildTree(connectedTrips, current, connection);
                    });
                    break;
                }
                if (current.nextRoutes.length > 0) {
                    for (const nextRoute of current.nextRoutes) {
                        queue.push(nextRoute);
                    }
                }
            }
        }
    }

    const routes: CurrentTrainroute[] = [];
    // Breadth traverse route tree to extract routes
    const queue: RouteNode[] = [routeTree];
    while (queue.length) {
        const current = queue.shift() || fallbackRouteNode;
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
