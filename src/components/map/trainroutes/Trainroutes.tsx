import "./trainroutes.scss";
import { memo } from "react";
import { useSelector } from "react-redux";
import {
    selectActiveSectionId,
    selectActiveSpot,
    selectPreviewSectionId,
} from "./TrainroutesSlice";
import { selectActiveVelorouteStop } from "../veloroutes/VeloroutesSlice";
import { Trainroute } from "./trainroute/Trainroute";
import { Veloroutes } from "../veloroutes/Veloroutes";
import { Label } from "../label/Label";
import { svgWidth, svgHeight } from "../../../utils/svgMap";
import { AnimatePresence, motion } from "framer-motion";
import { selectAppZoom } from "../../../AppSlice";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";
import { useTrainroutesAlongVelorouteSectionQuery } from "@/api/useTrainroutesAlongVelorouteSectionQuery";

export const Trainroutes = memo(function Trainroutes() {
    const clickedSectionId = useSelector(selectActiveSectionId);
    const hoveredSectionId = useSelector(selectPreviewSectionId);
    const activeSectionId = hoveredSectionId || clickedSectionId;
    const activeSpot = useSelector(selectActiveSpot);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const appZoom = useSelector(selectAppZoom);
    const { data: trainroutesQueryData } = useTrainroutesQuery();
    const currentTrainroutes = trainroutesQueryData?.currentTrainroutes;
    const { data: trainlinesAlongVeloroute } =
        useTrainroutesAlongVelorouteSectionQuery();
    const activeSection = currentTrainroutes?.find(
        (section) => section.id === activeSectionId,
    );

    const getClassName = (id: typeof activeSectionId) => {
        if (!activeSectionId && !trainlinesAlongVeloroute?.length) {
            return "init";
        } else if (activeSectionId === id) {
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
            {currentTrainroutes?.map((item, idx) => (
                <Trainroute
                    key={idx}
                    className={getClassName(item.id)}
                    item={item}
                />
            ))}

            {trainlinesAlongVeloroute?.map((item, idx) => (
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
                                pointerEvents="none"
                            />
                        )}
                    </AnimatePresence>
                    <Label
                        item={{
                            x: activeSpot
                                ? activeSpot.x
                                : activeVelorouteStop
                                  ? activeVelorouteStop.x
                                  : 0,
                            y: activeSpot
                                ? activeSpot.y
                                : activeVelorouteStop
                                  ? activeVelorouteStop.y
                                  : 0,
                            name: activeSpot
                                ? activeSpot.station_name
                                : activeVelorouteStop
                                  ? activeVelorouteStop.stop_name
                                  : "",
                        }}
                        className={activeSpot ? "train" : "veloroute"}
                    />
                </>
            )}
        </svg>
    );
});
