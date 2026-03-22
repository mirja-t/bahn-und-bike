import styles from "./tooltip.module.scss";

interface TooltipProps {
    text: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const Tooltip = ({ children, text, className }: TooltipProps) => {
    return (
        <button className={`${styles.tooltip} ${className || ""}`}>
            {children}
            <span className={styles.tooltipText}>{text}</span>
        </button>
    );
};
