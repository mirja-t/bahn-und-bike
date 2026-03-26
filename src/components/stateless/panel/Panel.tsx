import styles from "./panel.module.scss";

interface PanelProps {
    children: React.ReactNode;
    direction?: "row" | "column";
    variant?: "frostedGlass";
}

export const Panel = ({ children, direction = "row", variant }: PanelProps) => {
    return (
        <div
            className={`${styles.panelWrapper} ${styles[direction]} ${variant ? styles[variant] : ""}`}
        >
            {children}
        </div>
    );
};
