import "./trainstop.scss";
import { motion, AnimatePresence } from "framer-motion";
import { setActiveSpot, type CurrentTrainroute } from "../TrainroutesSlice";
import { selectUserScale, useAppDispatch } from "../../../../AppSlice";
import { useSelector } from "react-redux";

interface TrainstopProps {
    item: CurrentTrainroute["lastStation"];
    styles: {
        scale: number;
        transformOrigin: string;
    };
}

export const Trainstop = ({ item, styles }: TrainstopProps) => {
    const dispatch = useAppDispatch();
    const userScale = useSelector(selectUserScale);
    const hoverSpot = (
        e: React.MouseEvent,
        spot?: CurrentTrainroute["lastStation"],
    ) => {
        if (e.type === "mouseenter" && spot) dispatch(setActiveSpot(spot));
        else if (e.type === "mouseleave") dispatch(setActiveSpot(null));
    };

    return (
        <g className="destination">
            <g
                className="spotgroup"
                onMouseEnter={(e) => {
                    hoverSpot(e, item);
                }}
                onMouseLeave={hoverSpot}
            >
                <circle
                    className="spot-bg"
                    r={6 / userScale}
                    cx={item.x}
                    cy={item.y}
                />
                <motion.rect
                    className="spot spot-large"
                    x={item.x - 1.5 / userScale}
                    y={item.y - 1.5 / userScale}
                    width={3 / userScale}
                    height={3 / userScale}
                    style={{
                        scale: styles.scale,
                        transformOrigin: `${item.x}px ${item.y}px`,
                    }}
                />
                <AnimatePresence>
                    {item && (
                        <motion.rect
                            key={`trainstop-${item.stop_id || item.x}-${item.y}`}
                            className="spot spot-small"
                            x={item.x - 1.5 / userScale}
                            y={item.y - 1.5 / userScale}
                            width={3 / userScale}
                            height={3 / userScale}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 210,
                                damping: 20,
                                delay: 1.5,
                            }}
                            style={{
                                transformOrigin: `${item.x}px ${item.y}px`,
                            }}
                        />
                    )}
                </AnimatePresence>
            </g>
        </g>
    );
};
