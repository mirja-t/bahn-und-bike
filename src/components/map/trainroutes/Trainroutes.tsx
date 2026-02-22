import "./trainroutes.scss";
import { memo } from "react";
import { useSelector } from "react-redux";
import {
    selectCurrentTrainroutes,
    selectActiveSection,
    selectTrainroutesAlongVeloroute,
    selectActiveSpot,
} from "./TrainroutesSlice";
import {
    selectActiveVeloroute,
    selectActiveVelorouteStop,
} from "../veloroutes/VeloroutesSlice";
import { Trainroute } from "./trainroute/Trainroute";
import { Veloroutes } from "../veloroutes/Veloroutes";
import { Label } from "../label/Label";
import { svgWidth, svgHeight } from "../../../utils/svgMap";

interface TrainroutesProps {
    zoom: {
        containerHeight: number;
        containerWidth: number;
        x: number;
        y: number;
        scale: number;
    };
}

export const Trainroutes = memo(function Trainroutes({
    zoom,
}: TrainroutesProps) {
    const { containerHeight } = zoom;

    const journeys = useSelector(selectCurrentTrainroutes);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSpot = useSelector(selectActiveSpot);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const trainlinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );
    const strokeScale = containerHeight / 1080 / 2;

    const getClassName = (item: typeof activeSection) => {
        if (!activeSection && !trainlinesAlongVeloroute.length) {
            return "init";
        } else if (activeSection === item) {
            return "active";
        } else {
            return "inactive";
        }
    };

    return (
        <svg
            id="routes"
            x="0px"
            y="0px"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            xmlSpace="preserve"
        >
            {journeys.map((item, idx) => (
                <Trainroute
                    key={idx}
                    className={getClassName(item)}
                    item={item}
                    strokeScale={strokeScale}
                />
            ))}

            {trainlinesAlongVeloroute.map((item, idx) => (
                <Trainroute
                    key={idx}
                    className="active trainlinesAlongVeloroute"
                    item={item}
                    strokeScale={strokeScale}
                />
            ))}
            {activeSection && (
                <Trainroute
                    className="active"
                    item={activeSection}
                    strokeScale={strokeScale}
                />
            )}
            {activeVeloroute && <Veloroutes strokeScale={strokeScale} />}

            {(!!activeSpot || !!activeVelorouteStop) && (
                <Label
                    item={
                        activeSpot ||
                        activeVelorouteStop || {
                            x: 0,
                            y: 0,
                            stop_name: "",
                        }
                    }
                    className={activeSpot ? "train" : "veloroute"}
                    strokeScale={strokeScale}
                />
            )}
        </svg>
    );
});
