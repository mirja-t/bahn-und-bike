import styles from "./map.module.scss";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useZoom } from "../../hooks/useZoom";
import { useTranslation } from "../../utils/i18n";
import {
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "./trainroutes/TrainroutesSlice";
import { selectActiveVeloroute } from "./veloroutes/VeloroutesSlice";
import { Trainroutes } from "./trainroutes/Trainroutes";
import { Germany } from "./germany/Germany";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../stateless/loading/Loading";

interface MapProps {
    value: number;
    mapContainer: HTMLDivElement | null;
    mapSize: [number, number];
    fn: (dir: "+" | "-") => void;
    userScale: number;
}
export const Map = ({ value, mapContainer, mapSize, userScale }: MapProps) => {
    const mapcontainerRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const veloroute = useSelector(selectActiveVeloroute);

    const zoom = useZoom(
        journeys,
        veloroute,
        Number(value),
        mapContainer,
        mapSize,
        userScale,
        isLoading,
    );

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div className={styles.loading}>
                        <Loading />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* <ZoomPanel fn={fn} /> */}
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
                    style={{
                        left: zoom.x,
                        top: zoom.y,
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
