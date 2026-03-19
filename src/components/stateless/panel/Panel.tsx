import styles from "./panel.module.scss";

interface PanelProps {
    children: React.ReactNode;
    direction?: "row" | "column";
}

export const Panel = ({ children, direction = "row" }: PanelProps) => {
    return (
        <div className={`${styles.panelWrapper} ${styles[direction]}`}>
            {children}
        </div>
    );
};
