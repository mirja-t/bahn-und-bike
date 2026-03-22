import { useSelector } from "react-redux";
import { selectUserScale } from "../../../../AppSlice";
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
    const userScale = useSelector(selectUserScale);
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
                strokeWidth={active ? 1.5 / userScale : 1 / userScale}
                points={path}
            />
            <polyline
                className={styles.velorouteSectionLarge}
                strokeWidth={12 / userScale}
                points={path}
            />
        </g>
    );
};
