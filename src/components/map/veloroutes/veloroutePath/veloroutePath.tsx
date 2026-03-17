import styles from "../veloroutes.module.scss";

interface VeloroutePathProps {
    id: string;
    idx: number;
    strokeScale: number;
    path: string;
    active?: boolean;
    onClick?: (id: string, idx: number) => void;
    className?: string;
}

export const VeloroutePath = ({
    id,
    idx,
    strokeScale,
    path,
    active,
    onClick,
    className,
}: VeloroutePathProps) => {
    return (
        <g
            onClick={() => {
                if (onClick) {
                    onClick(id, idx);
                }
            }}
        >
            <path
                className={`${styles.velorouteSection} ${active ? styles.active : ""} ${className || ""}`}
                strokeWidth={active ? 1.5 / strokeScale : 1 / strokeScale}
                d={path}
            />
            <path
                className={styles.velorouteSectionLarge}
                strokeWidth={12 / strokeScale}
                d={path}
            />
        </g>
    );
};
