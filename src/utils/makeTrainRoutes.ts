import type {
    CurrentTrainroute,
    TrainstopsAPIResponse,
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
    stopGroup: TrainstopsAPIResponse,
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

                while (
                    currentRoute.nextRoutes.some(
                        (nextRoute) =>
                            nextRoute.route.routestops.at(-1)?.station_id ===
                            stop.station_id,
                    )
                ) {
                    const existingRoute = currentRoute.nextRoutes.find(
                        (nextRoute) =>
                            nextRoute.route.routestops.at(-1)?.station_id ===
                            stop.station_id,
                    );
                    if (!existingRoute) {
                        break;
                    }
                    currentRoute = existingRoute;
                    currentRoute.route.trainlines.push({
                        trainline_id: stop.trainline_id,
                        trainline_name: stop.name,
                    });
                }

                // if stopId is already in route, add trainline to existing route
                if (
                    !currentRoute.route.routestops.some(
                        (s) => s.station_id === stop.station_id,
                    )
                ) {
                    // create new route
                    const points = `${currentRoute.route.points}${stop.x},${stop.y} `;
                    const routestops = [...currentRoute.route.routestops, stop];
                    currentRoute.nextRoutes.push({
                        route: {
                            connection,
                            id: "",
                            name: "",
                            dur: currentRoute.route.dur + stop.dur,
                            trainlines: [
                                {
                                    trainline_id: stop.trainline_id,
                                    trainline_name: stop.name,
                                },
                            ],
                            firstStation: routeTree.route.firstStation,
                            lastStation: stop,
                            routestops,
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
                forwardRoute.map((stop, idx) => ({
                    ...stop,
                    stop_number:
                        typeof stop.stop_number === "number" &&
                        stop.stop_number !== null
                            ? idx
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
                        typeof stop.stop_number === "number" &&
                        stop.stop_number !== null
                            ? idx
                            : null,
                }));
            groupedDirectStops.push(reversedStops); // backward direction
        }
        return groupedDirectStops.filter((group) => group.length > 1); // Filter out groups that don't have any stops beyond the start station
    }

    function createTrainlineStopsArr(
        stopsGroup: TrainstopsAPIResponse,
        start: number,
    ): { [key: string]: Trainline } {
        /*
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
                        `Infinite loop detected while processing trainline stops for trainline ${trainlineId}. Remaining station ids: ${interpolationTrainlineStops
                            .map((stop) => stop.station_id)
                            .join(", ")}.`,
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
            if (interpolationTrainlineStops.length > 0) {
                console.warn(
                    `Could not resolve insertion point for all interpolation stops on trainline ${trainlineId}. 
                        .map((stop) => stop.station_id)
                        .join(", ")}.`,
                );
            }
            trainlineObj[trainlineId].stops = trainlineStopsArr;
        }*/
        const trainlineObj: { [key: string]: Trainline } = {};
        for (const trainlineId in stopsGroup) {
            const stops = stopsGroup[trainlineId];
            const trainlineStopsArr: Trainstop[] = stops.map((stop) => {
                const [x, y] = SvgMapBuilder.getMapPosition(
                    stop.lon,
                    stop.lat,
                    germanyBounds,
                );
                return { ...stop, x, y };
            });
            const startStop = stops.find(
                (stop) =>
                    stop.station_id === start && stop.stop_number !== null,
            );
            trainlineObj[trainlineId] = {
                trainline_id: trainlineId,
                startStopNumber:
                    startStop && typeof startStop.stop_number === "number"
                        ? startStop.stop_number
                        : -1,
                stops: trainlineStopsArr,
            };
        }
        return trainlineObj;
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
    const trainlinesObj = createTrainlineStopsArr(stopGroup, start);
    const trainlinesArr = Object.values(trainlinesObj);

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
            const trainlineIds = current.route.trainlines.map(
                (t) => t.trainline_id,
            );
            const stops = trainlineIds
                .map((id) => {
                    const idxOfFirstStation = trainlinesObj[id].stops.findIndex(
                        (stop) =>
                            stop.station_id ===
                            current.route.firstStation.station_id,
                    );
                    const idxOfLastStation = trainlinesObj[id].stops.findIndex(
                        (stop) =>
                            stop.station_id ===
                            current.route.lastStation.station_id,
                    );
                    if (idxOfFirstStation === -1 || idxOfLastStation === -1) {
                        console.warn(
                            `Could not find start or end station for trainline ${id} in stops array. Start station id: ${current.route.firstStation.station_id}, End station id: ${current.route.lastStation.station_id}. Skipping this trainline for route construction.`,
                        );
                        return [];
                    }

                    const sliced = (
                        trainlinesObj[id].stops as Trainstop[]
                    ).slice(
                        Math.min(idxOfFirstStation, idxOfLastStation),
                        Math.max(idxOfFirstStation, idxOfLastStation) + 1,
                    );
                    if (idxOfFirstStation > idxOfLastStation) {
                        sliced.reverse();
                    }
                    return sliced;
                })
                .flat()
                .filter(
                    (stop, idx, self) =>
                        stop.stop_number !== null &&
                        self
                            .slice(0, idx)
                            .every((s) => s.station_id !== stop.station_id), // Filter out duplicate stops across trainlines, but keep duplicates within the same trainline (for transfers)
                );

            const route = {
                id: `route-${stops.map((s) => s.station_id).join("-")}`,
                name: `${current.route.trainlines
                    .map((t) => t.trainline_name)
                    .join(", ")}: ${current.route.lastStation.station_name}`,
                routestops: stops,
                dur: current.route.dur,
                trainlines: current.route.trainlines,
                firstStation: current.route.firstStation,
                lastStation: current.route.lastStation,
                points: current.route.points,
                pathLength: current.route.pathLength,
                connection: current.route.connection,
            };

            routes.push(route);
        } else {
            for (const nextRoute of current.nextRoutes) {
                queue.push(nextRoute);
            }
        }
    }
    return routes;
};
