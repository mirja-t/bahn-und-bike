import type { CurrentTrainroute } from "../components/map/trainroutes/TrainroutesSlice";
import type { VelorouteStop } from "../components/map/veloroutes/VeloroutesSlice";

// get the farthest distance to the starting point by direction
export const getLongestDistance = (
    trainroutes: CurrentTrainroute[],
    coord: "x" | "y",
    xStart: number,
    veloroute?: {
        route: {
            leg: VelorouteStop[];
        }[];
    },
) => {
    if (trainroutes.length === 0) return 0;
    const velorouteDistances: number[] = veloroute
        ? veloroute.route
              .map((el) => el.leg.map((s) => s[coord]))
              .reduce((acc, el) => acc.concat(el), [])
        : [];
    const trainrouteDistances: number[] = trainroutes.map(
        (el) => el.lastStation[coord],
    );

    return trainrouteDistances.concat(velorouteDistances).reduce((acc, el) => {
        return Math.max(Math.abs(el - xStart), acc);
    }, 0);
};
