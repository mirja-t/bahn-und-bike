import type { CurrentTrainroute } from "../components/map/trainroutes/TrainroutesSlice";

// get the journey center avarage origin on the map
export const getCenterPosition = (
    trainroutes: CurrentTrainroute[],
    coord: "x" | "y",
) => {
    const devider = trainroutes.length > 0 ? trainroutes.length : 1;
    return (
        trainroutes
            .map((el) => el.firstStation[coord])
            .reduce((acc, el) => acc + el, 0) / devider
    );
};
