import type {
    CurrentTrainroute,
    ResponseStop,
    Train,
    Trainstop,
} from "../components/map/trainroutes/TrainroutesSlice";
import { createNewRoute } from "./createNewRoute";
import { getPathLengthFromPoints } from "./getPathLength";
import { germanyBounds, SvgMapBuilder } from "./svgMap";

type Trainline = {
    trainline_id: string;
    startStopNumber: number;
    stops: Trainstop[];
};

type RouteNode = {
    route: CurrentTrainroute;
    nextRoutes: RouteNode[];
};

const fallbackRouteNode: RouteNode = {
    route: createNewRoute({
        name: "",
        lat: 0,
        lon: 0,
        station_id: Infinity,
        station_name: "",
        dur: 0,
        stop_number: 0,
        trainline_id: "",
        next_station_id: Infinity,
    }),
    nextRoutes: [],
};

export const makeTrainRoutes = (
    stops: ResponseStop[],
    start: number,
    durationLimit: number,
    direct: boolean = true,
): CurrentTrainroute[] => {
    function buildTree(
        groupedStops: Trainstop[][],
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
                    (r) => r.route.lastStation.station_id === stop.station_id,
                );
                if (nextRoute) {
                    currentRoute = nextRoute;
                }
                // if stop is already in route, add trainline to existing route
                if (
                    stop.station_id ===
                    currentRoute.route.lastStation.station_id
                ) {
                    // Add trainline to connecting route
                    if (
                        connection &&
                        currentRoute.route.connection &&
                        !currentRoute.route.connection.connecting_trains
                            .map((t) => t.trainline_id)
                            .includes(stop.trainline_id)
                    ) {
                        if (!stop.trainline_id || !stop.name) {
                            console.warn(
                                "makeTrainRoutes – Missing trainline_id or name for stop:",
                                stop,
                            );
                        }
                        currentRoute.route.connection?.connecting_trains.push({
                            trainline_id: stop.trainline_id,
                            trainline_name: stop.name,
                        });
                        currentRoute.route.name = `${currentRoute.route.trainlines.map((t) => t.trainline_name).join(", ")} + ${connection.connecting_trains.map((t) => t.trainline_name).join(", ")}: ${currentRoute.route.firstStation.station_name} – ${currentRoute.route.lastStation.station_name}`;
                    }
                    // Add trainline to existing route - only if it is not the connecting trainline
                    else if (
                        !currentRoute.route.trainlines
                            .map((t) => t.trainline_id)
                            .includes(stop.trainline_id) &&
                        !connection
                    ) {
                        currentRoute.route.trainlines.push({
                            trainline_id: stop.trainline_id,
                            trainline_name: stop.name,
                        });
                        currentRoute.route.name = `${currentRoute.route.trainlines.map((t) => t.trainline_name).join(", ")}: ${currentRoute.route.firstStation.station_name} – ${currentRoute.route.lastStation.station_name}`;
                    }
                } else {
                    // create new route
                    const points = `${currentRoute.route.points}${stop.x},${stop.y} `;
                    const stops = [...currentRoute.route.stops, stop];
                    let name = `${stop.name}: ${currentRoute.route.firstStation.station_name} – ${stop.station_name}`;
                    let trainlines: Train[] = [];
                    if (connection) {
                        name = `${currentRoute.route.trainlines.map((t) => t.trainline_name).join(", ")} + ${connection.connecting_trains.map((t) => t.trainline_name).join(", ")}: ${currentRoute.route.firstStation.station_name} – ${stop.station_name}`;
                        trainlines = connection.initial_trains;
                    } else {
                        trainlines.push({
                            trainline_id: stop.trainline_id,
                            trainline_name: stop.name,
                        });
                    }
                    currentRoute.nextRoutes.push({
                        route: {
                            connection,
                            id: stops.map((s) => s.station_id).join("-"),
                            name,
                            dur: currentRoute.route.dur + stop.dur,
                            trainlines,
                            firstStation: routeTree.route.firstStation,
                            lastStation: stop,
                            stops,
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
        const groupedDirectStops: Trainstop[][] = [];
        const { startStopNumber, stops: stopsRef } = trainlineStopsArr; // Use this trainline's stops and start index to build forward and backward stop groups
        const stops = structuredClone(stopsRef); // Create a mutable copy of the stops array for this trainline
        if (startStopNumber >= 0) {
            const startStopIdx = stops.findIndex(
                (stop) => stop.stop_number === startStopNumber,
            );
            const forwardRoute = stops.slice(startStopIdx); // forward direction
            groupedDirectStops.push(
                forwardRoute.map((stop) => ({
                    ...stop,
                    stop_number:
                        typeof stop.stop_number === "number"
                            ? stop.stop_number - startStopNumber
                            : null,
                })),
            ); // forward direction
            const reversedStops = stops
                .slice(0, startStopIdx + 1)
                .reverse()
                .map((stop, idx, arr) => ({
                    ...stop,
                    dur:
                        idx === 0
                            ? 0
                            : (arr
                                  .slice(0, idx)
                                  .filter((s) => s.dur !== 0)
                                  .at(-1)?.dur ?? 0), // take duration from prev stop
                    stop_number:
                        typeof stop.stop_number === "number"
                            ? arr.length - 1 - idx - startStopNumber
                            : null,
                }));
            groupedDirectStops.push(reversedStops); // backward direction
        }
        return groupedDirectStops.filter((group) => group.length > 1); // Filter out groups that don't have any stops beyond the start station
    }
    function createTrainlineStopsArr(
        stops: ResponseStop[],
        start: number,
    ): Trainline[] {
        const trainlineObj = stops.reduce(
            (acc, stop) => {
                if (!acc[stop.trainline_id]) {
                    acc[stop.trainline_id] = {
                        trainline_id: stop.trainline_id,
                        startStopNumber: -1,
                        stops: [],
                    };
                }
                if (stop.station_id === start && stop.stop_number !== null) {
                    acc[stop.trainline_id].startStopNumber = stop.stop_number;
                }
                const [x, y] = SvgMapBuilder.getMapPosition(
                    stop.lon,
                    stop.lat,
                    germanyBounds,
                );
                acc[stop.trainline_id].stops.push({ ...stop, x, y });
                return acc;
            },
            {} as { [key: Trainstop["trainline_id"]]: Trainline },
        );

        for (const trainlineId in trainlineObj) {
            const stops = trainlineObj[trainlineId].stops;
            const sortedByStopNumber: Trainstop[] = stops
                .filter(
                    (stop): stop is typeof stop & { stop_number: number } =>
                        stop.stop_number !== null,
                )
                .sort((a, b) => a.stop_number - b.stop_number);
            const interpolationTrainlineStops = stops.filter(
                (stop) => stop.stop_number === null,
            );
            const trainlineStopsArr = sortedByStopNumber.slice();
            let counter = 0;
            while (interpolationTrainlineStops.length > 0) {
                counter++;
                if (counter > 100) {
                    console.warn(
                        "Infinite loop detected while processing trainline stops.",
                    );
                    break;
                }
                const currentStop = interpolationTrainlineStops.shift();
                if (!currentStop) {
                    break;
                }
                const indexToInsert = trainlineStopsArr.findIndex(
                    (s) => s.next_station_id === currentStop.station_id,
                );
                if (indexToInsert === -1) {
                    interpolationTrainlineStops.push(currentStop); // Push it back to the end of the array to try again later
                } else {
                    trainlineStopsArr.splice(indexToInsert + 1, 0, currentStop);
                }
            }
            trainlineObj[trainlineId].stops = trainlineStopsArr;
        }

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
        (line) => line.startStopNumber >= 0,
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
            (line) => line.startStopNumber < 0,
        );
        while (trainlinesWithoutStartDest.length > 0) {
            const trainlineToAdd = trainlinesWithoutStartDest.shift() || {
                stops: [],
                trainline_id: "",
                startStopNumber: -1,
            };
            const queue: RouteNode[] = [routeTree];
            while (queue.length) {
                const current = queue.shift() || fallbackRouteNode;
                const isConnected = trainlineToAdd.stops.some(
                    (stop) =>
                        stop.station_id ===
                        current.route.lastStation.station_id,
                );
                if (isConnected) {
                    trainlineToAdd.startStopNumber =
                        trainlineToAdd.stops.findIndex(
                            (stop) =>
                                stop.station_id ===
                                current.route.lastStation.station_id,
                        );
                    const connectedTrips = [trainlineToAdd]
                        .map(createNestedStopsGroups)
                        .flat();
                    connectedTrips.forEach((connectedTrip) => {
                        const connection = {
                            connecting_trains: [
                                {
                                    trainline_id: connectedTrip[0].trainline_id,
                                    trainline_name: connectedTrip[0].name,
                                },
                            ],
                            initial_trains: current.route.trainlines,
                            station_name:
                                current.route.lastStation.station_name,
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
