import { useSelector } from "react-redux";
import { useTrainroutesQuery } from "./useTrainroutesQuery";
import {
    selectIsDirect,
    selectStartPos,
    selectTrainTravelDuration,
} from "@/components/map/trainroutes/TrainroutesSlice";
import { useVelorouteQuery } from "./useVelorouteQuery";
import {
    selectActiveVelorouteId,
    selectActiveVelorouteSectionIdx,
    selectMaxDistToNextStation,
} from "@/components/map/veloroutes/VeloroutesSlice";

export const useQueryCache = () => {
    const startPos = useSelector(selectStartPos);
    const isDirect = useSelector(selectIsDirect);
    const travelDuration = useSelector(selectTrainTravelDuration);
    const { data: trainroutesQueryData } = useTrainroutesQuery({
        start: startPos,
        value: travelDuration,
        direct: isDirect,
    });

    const maxDistToNextStation = useSelector(selectMaxDistToNextStation);
    const activeVelorouteId = useSelector(selectActiveVelorouteId);
    const activeVelorouteSectionIdx = useSelector(
        selectActiveVelorouteSectionIdx,
    );
    const trainstops = trainroutesQueryData?.trainstops;
    const { data: activeVeloroute } = useVelorouteQuery({
        id: activeVelorouteId,
        trainstops: trainstops || [],
        maxDistToNextStation,
    });
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVelorouteId !== null
            ? activeVeloroute?.route[activeVelorouteSectionIdx]
            : null;
    const activeVelorouteSectionStartId =
        !!activeVeloroute && !!activeVelorouteSectionIdx
            ? activeVeloroute.route[activeVelorouteSectionIdx]?.leg[0].trainstop
            : null;
    const activeVelorouteSectionEndId =
        !!activeVeloroute && !!activeVelorouteSectionIdx
            ? activeVeloroute.route[activeVelorouteSectionIdx]?.leg[
                  activeVeloroute.route[activeVelorouteSectionIdx].leg.length -
                      1
              ].trainstop
            : null;
    return {
        activeVeloroute,
        activeVelorouteSection,
        trainstops,
        activeVelorouteSectionStartId,
        activeVelorouteSectionEndId,
    };
};
