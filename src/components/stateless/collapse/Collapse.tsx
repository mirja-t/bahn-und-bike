import styles from "./collapse.module.scss";
import { useState, type ReactNode } from "react";

interface CollapseProps {
    children: ReactNode;
    title: string;
}

export const Collapse = ({ children, title }: CollapseProps) => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className={styles.collapse}>
            <button
                type="button"
                onClick={() => setToggle((prev) => !prev)}
                className={
                    toggle
                        ? `${styles.toggle} ${styles.on}`
                        : `${styles.toggle} ${styles.off}`
                }
            >
                {title}
            </button>
            <div
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
