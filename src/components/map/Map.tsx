import styles from "./map.module.scss";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useZoom } from "../../hooks/useZoom";
import { useDrag } from "../../hooks/useDrag";
import { usePinch } from "../../hooks/usePinch";
import {
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "./trainroutes/TrainroutesSlice";
import { Trainroutes } from "./trainroutes/Trainroutes";
import { Germany } from "./germany/Germany";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../stateless/loading/Loading";
import { ZoomPanel } from "../stateless/zoomPanel/ZoomPanel";
import { setUserScale, selectUserScale, useAppDispatch } from "../../AppSlice";
import { selectVeloroutesLoading } from "./veloroutes/VeloroutesSlice";

interface MapProps {
    value: number;
    mapContainer: HTMLDivElement | null;
    mapSize: [number, number];
}
export const Map = ({ value, mapContainer, mapSize }: MapProps) => {
    const mapcontainerRef = useRef<HTMLDivElement | null>(null);
    const zoomcontainerRef = useRef<HTMLDivElement | null>(null);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const veloroutesLoading = useSelector(selectVeloroutesLoading);
    const userScale = useSelector(selectUserScale);
    const dispatch = useAppDispatch();

    const handleMapZoom = (dir: "+" | "-") => {
        const factor = dir === "+" ? 1 : -1;
        dispatch(setUserScale(0.2 * factor));
    };

    const pinchScale = usePinch(zoomcontainerRef);
    useEffect(() => {
        if (!mapcontainerRef.current || !zoomcontainerRef.current) return;
        if (pinchScale.deltaY) {
            dispatch(setUserScale(pinchScale.deltaY / -100));
        }
    }, [pinchScale, dispatch]);

    const zoom = useZoom(
        journeys,
        null,
        Number(value),
        mapContainer,
        mapSize,
        isLoading,
    );
    const scaleOriginX = zoom.x / zoom.containerWidth;
    const scaleOriginY = zoom.y / zoom.containerHeight;

    const drag = useDrag(value);

    return (
        <>
            <AnimatePresence>
                {(isLoading || veloroutesLoading) && (
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
                }}
            >
                <div
                    ref={zoomcontainerRef}
                    style={{
                        width: 100 * userScale + "%",
                        height: 100 * userScale + "%",
                        position: "relative",
                        marginLeft:
                            -(((userScale - 1) * zoom.containerWidth) / 2) *
                                (1 - scaleOriginX) +
                            "px",
                        marginTop:
                            -(
                                ((((userScale - 1) * zoom.containerHeight) /
                                    2) *
                                    zoom.containerHeight) /
                                zoom.containerWidth
                            ) *
                                (1 - scaleOriginY) +
                            "px",
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
                            height: "100%",
                            width: "100%",
                        }}
                        className={styles.mapInner}
                    >
                        {!isLoading && <Trainroutes />}
                        <Germany />
                    </motion.div>
                </div>
            </div>
        </>
    );
};
