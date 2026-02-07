import { groupRoutes } from "./groupRoutes";
export const generateTrainlines = (stops) => {
    /**
     * Create Object with trainline stops
     * keyed by trainline id
     */
    const trainlineStops = {};
    while (stops.length) {
        const trainStops = groupRoutes(stops);
        trainlineStops[trainStops[0].trainline_id] = trainStops;
    }

    return trainlineStops;
};
