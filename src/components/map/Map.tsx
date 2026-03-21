import styles from "./map.module.scss";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useZoom } from "../../hooks/useZoom";
import { useDrag } from "../../hooks/useDrag";
import { usePinch } from "../../hooks/usePinch";
import { useTranslation } from "../../utils/i18n";
import {
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "./trainroutes/TrainroutesSlice";
import { Trainroutes } from "./trainroutes/Trainroutes";
import { Germany } from "./germany/Germany";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../stateless/loading/Loading";
import { ZoomPanel } from "../stateless/zoomPanel/ZoomPanel";

interface MapProps {
    value: number;
    mapContainer: HTMLDivElement | null;
    mapSize: [number, number];
}
export const Map = ({ value, mapContainer, mapSize }: MapProps) => {
    const mapcontainerRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const [userScale, setUserScale] = useState(1);

    const handleMapZoom = (dir: "+" | "-") => {
        const factor = dir === "+" ? 1 : -1;
        setUserScale(prev =>
            Math.max(0.1, Number((prev + factor * 0.2).toFixed(1))),
        );
    };

    usePinch(mapcontainerRef, userScale, setUserScale);

    const zoom = useZoom(
        journeys,
        null,
        Number(value),
        mapContainer,
        mapSize,
        userScale,
        isLoading,
    );

    const drag = useDrag(value);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div className={styles.loading}>
                        <Loading />
                    </motion.div>
                )}
            </AnimatePresence>
            <ZoomPanel fn={handleMapZoom} />
            <div
                className={styles.mapContainer}
                ref={mapcontainerRef}
                style={{
                    width: zoom.containerWidth,
                    height: zoom.containerHeight,
                    transform: `translate(-50%, -50%)`,
                }}
            >
                <motion.div
                    drag
                    dragMomentum={false}
                    style={{
                        left: zoom.x,
                        top: zoom.y,
                        x: drag.x,
                        y: drag.y,
                        touchAction: "none",
                    }}
                    className={styles.mapInner}
                >
                    {!isLoading && (
                        <>
                            {value === 0 &&
                                journeys.length === 0 &&
                                !isLoading && (
                                    <div className="instructions">
                                        <p>{t("instruction")}</p>
                                    </div>
                                )}
                            <Trainroutes zoom={zoom} />
                        </>
                    )}
                    <Germany />
                </motion.div>
            </div>
        </>
    );
};
