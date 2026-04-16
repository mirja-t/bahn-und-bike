import "./trainroutes.scss";
import { memo } from "react";
import { useSelector } from "react-redux";
import {
    selectCurrentTrainroutes,
    selectActiveSection,
    selectTrainroutesAlongVeloroute,
    selectActiveSpot,
    selectPreviewSection,
} from "./TrainroutesSlice";
import { selectActiveVelorouteStop } from "../veloroutes/VeloroutesSlice";
import { Trainroute } from "./trainroute/Trainroute";
import { Veloroutes } from "../veloroutes/Veloroutes";
import { Label } from "../label/Label";
import { svgWidth, svgHeight } from "../../../utils/svgMap";
import { AnimatePresence, motion } from "framer-motion";
import { selectAppZoom } from "../../../AppSlice";

export const Trainroutes = memo(function Trainroutes() {
    const journeys = useSelector(selectCurrentTrainroutes);
    const clickedSection = useSelector(selectActiveSection);
    const hoveredSection = useSelector(selectPreviewSection);
    const activeSection = hoveredSection || clickedSection;
    const activeSpot = useSelector(selectActiveSpot);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const trainlinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );
    const appZoom = useSelector(selectAppZoom);

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
                />
            ))}

            {trainlinesAlongVeloroute.map((item, idx) => (
                <Trainroute
                    key={idx}
                    className="active trainlinesAlongVeloroute"
                    item={item}
                />
            ))}
            {activeSection && (
                <Trainroute className="active" item={activeSection} />
            )}
            <Veloroutes />

            {(!!activeSpot || !!activeVelorouteStop) && (
                <>
                    {/* dot train */}
                    <AnimatePresence>
                        {activeSpot && (
                            <motion.rect
                                x={activeSpot.x - 5 / appZoom}
                                y={activeSpot.y - 5 / appZoom}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.35 }}
                                width={10 / appZoom}
                                height={10 / appZoom}
                                fill="var(--train-active)"
                                pointerEvents="none"
                            />
                        )}
                    </AnimatePresence>
                    {/* dot bikestop */}
                    <AnimatePresence>
                        {activeVelorouteStop && (
                            <motion.circle
                                cx={activeVelorouteStop.x}
                                cy={activeVelorouteStop.y}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.35 }}
                                r={6 / appZoom}
                                fill="var(--bike)"
                            />
                        )}
                    </AnimatePresence>
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
                    />
                </>
            )}
        </svg>
    );
});
