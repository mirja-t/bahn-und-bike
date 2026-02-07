import "./veloroutestop.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    setActiveVelorouteStop,
    selectActiveVelorouteStop,
} from "../VeloroutesSlice";
import { motion } from "framer-motion";

interface VelorouteStopProps {
    item: {
        stop_id: string;
        stop_name: string;
        x: number;
        y: number;
        trainlines?: string[];
    };
    strokeScale: number;
    type: string;
}

export const VelorouteStop = ({
    item,
    strokeScale,
    type,
}: VelorouteStopProps) => {
    const dispatch = useDispatch();
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);

    const hoverVeloStop = (
        { type }: React.MouseEvent<SVGCircleElement>,
        spot?: VelorouteStopProps["item"],
    ) => {
        if (type === "mouseenter" && spot) {
            return dispatch(setActiveVelorouteStop(spot));
        }
        dispatch(setActiveVelorouteStop(null));
    };

    return (
        <g>
            <motion.circle
                className="veloroute-stop-outline"
                strokeWidth={0.8 / strokeScale}
                cx={item.x}
                cy={item.y}
                r={4 / strokeScale}
                style={{
                    transformOrigin: `${item.x}px ${item.y}px`,
                }}
                initial={{
                    opacity: 0,
                    scale: 0,
                }}
                animate={{
                    opacity: type === "active" ? 1 : 0,
                    scale: type === "active" ? 1 : 0,
                }}
            />
            <circle
                className={
                    type === "active"
                        ? "veloroute-stop active"
                        : "veloroute-stop"
                }
                cx={item.x}
                cy={item.y}
                r={
                    type === "active" ||
                    activeVelorouteStop?.stop_id === item.stop_id
                        ? 2 / strokeScale
                        : 1.2 / strokeScale
                }
                onMouseEnter={(e) => hoverVeloStop(e, item)}
                onMouseLeave={hoverVeloStop}
                style={{
                    transformOrigin: `${item.x}px ${item.y}px`,
                }}
            />
        </g>
    );
};
