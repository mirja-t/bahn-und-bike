import styles from "./collapse.module.scss";
import { useEffect, useId, useState, type ReactNode } from "react";

interface CollapseProps {
    children: ReactNode;
    title: string;
    variant?: "primary" | "minify";
    open?: boolean;
}

export const Collapse = ({ children, title, variant, open }: CollapseProps) => {
    const [toggle, setToggle] = useState(false);
    const buttonId = useId();
    const contentId = useId();

    useEffect(() => {
        if (!!open) {
            setToggle(true);
        }
    }, [open]);

    return (
        <div
            className={`${styles.collapse} ${variant === "minify" ? styles.minify : ""}`}
        >
            <button
                id={buttonId}
                type="button"
                onClick={() => setToggle((prev) => !prev)}
                aria-expanded={toggle}
                aria-controls={contentId}
                className={
                    toggle
                        ? `${styles.toggle} ${styles.on} h5`
                        : `${styles.toggle} ${styles.off} h5`
                }
            >
                {title}
            </button>
            <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={
                    toggle
                        ? `${styles.toggleContainer} ${styles.on}`
                        : `${styles.toggleContainer} ${styles.off}`
                }
            >
                {children}
            </div>
        </div>
    );
};
