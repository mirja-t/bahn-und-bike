import {
    setActiveSection,
    setTrainroutesAlongVeloroute,
    type CurrentTrainroute,
} from "../TrainroutesSlice";
import {
    loadVeloroutes,
    setActiveVeloroute,
    setActiveVelorouteSection,
} from "../../veloroutes/VeloroutesSlice";
import { Trainstop } from "../trainstop/Trainstop";
import {
    selectUserScale,
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
    const userScale = useSelector(selectUserScale);

    const setAdditionalTrainlineActive = (line: CurrentTrainroute) => {
        const stopIds = line.stopIds;
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
        dispatch(loadVeloroutes(stopIds));
        dispatch(setActiveTab("veloroutes"));
    };

    return (
        <g
            className={`${className} routegroup`}
            onClick={() => setAdditionalTrainlineActive(item)}
        >
            <polyline
                className="route-bg"
                strokeWidth={5 / userScale}
                points={item.points}
            />
            <polyline
                className={"route"}
                strokeWidth={1 / userScale}
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
