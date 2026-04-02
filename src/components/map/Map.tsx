import styles from "./map.module.scss";
import { useSelector } from "react-redux";
import { useZoom } from "../../hooks/useZoom";
import { useDrag } from "../../hooks/useDrag";
import {
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "./trainroutes/TrainroutesSlice";
import { Trainroutes } from "./trainroutes/Trainroutes";
import { Germany } from "./germany/Germany";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../stateless/loading/Loading";
import { ZoomPanel } from "../stateless/zoomPanel/ZoomPanel";
import {
    setUserScale,
    useAppDispatch,
    selectResetKey,
    setAppScale,
    selectAppZoom,
} from "../../AppSlice";
import { selectVeloroutesLoading } from "./veloroutes/VeloroutesSlice";
import { useEffect, useRef, useState } from "react";

interface MapProps {
    value: number;
}
export const Map = ({ value }: MapProps) => {
    const mapWrapperRef = useRef<HTMLDivElement | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const resetKey = useSelector(selectResetKey);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const veloroutesLoading = useSelector(selectVeloroutesLoading);
    const appZoom = useSelector(selectAppZoom);
    const dispatch = useAppDispatch();
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [cachedOffset, setCachedOffset] = useState({ x: 0, y: 0 });

    const handleMapZoom = (dir: "+" | "-") => {
        const factor = dir === "+" ? 2 : 0.5;
        dispatch(setUserScale(factor));
        setOffset((prev) => ({
            x: prev.x + cachedOffset.x,
            y: prev.y + cachedOffset.y,
        }));
        drag.x.set(0);
        drag.y.set(0);
        setCachedOffset({ x: 0, y: 0 });
    };

    const zoom = useZoom(journeys, Number(value), isLoading);
    const containerRatio =
        zoom.ratio /
        ((mapWrapperRef.current?.offsetWidth || 1) /
            (mapWrapperRef.current?.offsetHeight || 1));

    const drag = useDrag(resetKey);
    useEffect(() => {
        dispatch(setAppScale(zoom.scale));
    }, [dispatch, zoom]);

    const handleDragEnd = () => {
        const offsetX =
            drag.x.get() /
            (mapContainerRef.current?.offsetWidth || 0) /
            appZoom;
        const offsetY =
            drag.y.get() /
            (mapContainerRef.current?.offsetHeight || 0) /
            appZoom;
        setCachedOffset({ x: offsetX, y: offsetY });
    };

    useEffect(() => {
        setOffset({
            x: zoom.x,
            y: zoom.y,
        });
        setCachedOffset({ x: 0, y: 0 });
    }, [zoom]);

    return (
        <div ref={mapWrapperRef} className={styles.mapWrapper}>
            <AnimatePresence>
                {(isLoading || veloroutesLoading) && (
                    <motion.div className={styles.loading}>
                        <Loading />
                    </motion.div>
                )}
            </AnimatePresence>
            <ZoomPanel fn={handleMapZoom} />
            <div
                className={styles.mapInnerWrapper}
                style={{
                    width: 100 * Math.min(containerRatio, 1) + "%",
                }}
            >
                <div className={styles.mapContainer} ref={mapContainerRef}>
                    <motion.div
                        className={styles.mapInnerContainer}
                        drag
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        style={{
                            x: drag.x,
                            y: drag.y,
                        }}
                    >
                        <div
                            className={styles.map}
                            style={{
                                transform: `scale(${appZoom})`,
                            }}
                        >
                            <div
                                style={{
                                    transform: `translate(${offset.x * 100}%, ${offset.y * 100}%)`,
                                }}
                            >
                                {!isLoading && <Trainroutes />}
                                <Germany />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
