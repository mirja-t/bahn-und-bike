import "./trainstop.scss";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setActiveSpot, type Trainstop as Item } from "../TrainroutesSlice";

interface TrainstopProps {
    item: Item;
    strokeScale: number;
    styles: any;
}

export const Trainstop = ({ item, strokeScale, styles }: TrainstopProps) => {
    const dispatch = useDispatch();
    const hoverSpot = (e: React.MouseEvent, spot?: any) => {
        if (e.type === "mouseenter") dispatch(setActiveSpot(spot || item));
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
                    r={6 / strokeScale}
                    cx={item.x}
                    cy={item.y}
                />
                <motion.rect
                    className="spot spot-large"
                    x={item.x - 1.5 / strokeScale}
                    y={item.y - 1.5 / strokeScale}
                    width={3 / strokeScale}
                    height={3 / strokeScale}
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
                            x={item.x - 1.5 / strokeScale}
                            y={item.y - 1.5 / strokeScale}
                            width={3 / strokeScale}
                            height={3 / strokeScale}
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
