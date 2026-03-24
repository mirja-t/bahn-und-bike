import styles from "./veloroutestop.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    setActiveVelorouteStop,
    selectActiveVelorouteStop,
    type VelorouteStop as VelorouteStopType,
    setActiveVelorouteSection,
} from "../VeloroutesSlice";
import { motion } from "framer-motion";
import { selectUserScale } from "../../../../AppSlice";

interface VelorouteStopProps {
    item: VelorouteStopType;
    type: string;
    idx: number;
}

export const VelorouteStop = ({ item, type, idx }: VelorouteStopProps) => {
    const dispatch = useDispatch();
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const userScale = useSelector(selectUserScale);

    const hoverVeloStop = (
        { type }: React.MouseEvent<SVGCircleElement>,
        spot?: VelorouteStopType,
    ) => {
        if (type === "mouseenter" && spot) {
            return dispatch(setActiveVelorouteStop(spot));
        }
        dispatch(setActiveVelorouteStop(null));
    };
    const handleClick = () => {
        dispatch(setActiveVelorouteSection(idx));
    };

    return (
        <g>
            <motion.circle
                className={styles.velorouteStopOutline}
                strokeWidth={0.8 / userScale}
                cx={item.x}
                cy={item.y}
                r={4 / userScale}
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
                        ? `${styles.velorouteStop} ${styles.active}`
                        : styles.velorouteStop
                }
                cx={item.x}
                cy={item.y}
                r={
                    type === "active" ||
                    activeVelorouteStop?.stop_id === item.stop_id
                        ? 1 / userScale
                        : 1.2 / userScale
                }
                style={{
                    transformOrigin: `${item.x}px ${item.y}px`,
                }}
            />
            <circle
                cx={item.x}
                cy={item.y}
                r={3 / userScale}
                onClick={handleClick}
                onMouseEnter={(e) => hoverVeloStop(e, item)}
                onMouseLeave={hoverVeloStop}
                style={{
                    transformOrigin: `${item.x}px ${item.y}px`,
                    fill: "transparent",
                }}
            />
        </g>
    );
};
