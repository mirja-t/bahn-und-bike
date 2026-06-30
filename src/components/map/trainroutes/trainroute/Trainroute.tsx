import {
    setActiveSectionId,
    type CurrentTrainroute,
} from "../TrainroutesSlice";
import {
    setActiveVelorouteId,
    setActiveVelorouteSectionIdx,
} from "../../veloroutes/VeloroutesSlice";
import { Trainstop } from "../trainstop/Trainstop";
import {
    selectAppZoom,
    setActiveTab,
    useAppDispatch,
} from "../../../../AppSlice";
import { useSelector } from "react-redux";

interface TrainrouteProps {
    item: CurrentTrainroute;
    className: string;
}

export const Trainroute = ({ item, className }: TrainrouteProps) => {
    const dispatch = useAppDispatch();
    const appZoom = useSelector(selectAppZoom);

    const setAdditionalTrainlineActive = (line: CurrentTrainroute) => {
        dispatch(setActiveVelorouteId(null));
        dispatch(setActiveVelorouteSectionIdx(null));
        dispatch(setActiveSectionId(line.id));
        dispatch(setActiveTab("veloroutes"));
    };

    return (
        <g
            className={`${className} routegroup`}
            onClick={() => setAdditionalTrainlineActive(item)}
        >
            <polyline
                className="route-bg"
                strokeWidth={12 / appZoom}
                points={item.points}
            />
            <polyline
                className={"route"}
                strokeWidth={2 / appZoom}
                points={item.points}
                style={{
                    strokeDashoffset: item.pathLength,
                    strokeDasharray: item.pathLength,
                }}
            />
            {item && item.lastStation && (
                <Trainstop
                    styles={{ scale: 1, transformOrigin: "center" }}
                    item={item.lastStation}
                />
            )}
        </g>
    );
};
