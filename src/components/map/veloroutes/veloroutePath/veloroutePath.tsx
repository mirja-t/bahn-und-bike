import { useSelector } from "react-redux";
import { selectAppZoom } from "../../../../AppSlice";
import styles from "../veloroutes.module.scss";

interface VeloroutePathProps {
    id: string;
    idx: number;
    path: string;
    active?: boolean;
    onClick?: (id: string, idx: number) => void;
    className?: string;
}

export const VeloroutePath = ({
    id,
    idx,
    path,
    active,
    onClick,
    className,
}: VeloroutePathProps) => {
    const appZoom = useSelector(selectAppZoom);
    return (
        <g
            onClick={() => {
                if (onClick) {
                    onClick(id, idx);
                }
            }}
        >
            <polyline
                className={`${styles.velorouteSection} ${active ? styles.active : ""} ${className || ""}`}
                strokeWidth={active ? 2 / appZoom : 1 / appZoom}
                points={path}
            />
            <polyline
                className={styles.velorouteSectionLarge}
                strokeWidth={10 / appZoom}
                points={path}
            />
        </g>
    );
};
