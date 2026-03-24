import styles from "./veloroutestop.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
    setActiveVelorouteStop,
    type VelorouteStop as VelorouteStopType,
    setActiveVelorouteSection,
} from "../VeloroutesSlice";
import { selectUserScale } from "../../../../AppSlice";
import { MapPinIcon } from "../../../stateless/icons/MapPinIcon";

interface VelorouteStopProps {
    item: VelorouteStopType;
    type: string;
    idx: number;
}

export const VelorouteStop = ({ item, type, idx }: VelorouteStopProps) => {
    const dispatch = useDispatch();
    const userScale = useSelector(selectUserScale);
    const active = type.includes("active");
    const start = type.includes("start");

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
            <MapPinIcon
                idx={start ? 1 : 2}
                active={active}
                position={{ x: item.x, y: item.y }}
                userScale={userScale}
            />
            <circle
                className={
                    active
                        ? `${styles.velorouteStop} ${styles.active}`
                        : styles.velorouteStop
                }
                cx={item.x}
                cy={item.y}
                r={1 / userScale}
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
