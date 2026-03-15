import styles from "./collapse.module.scss";
import { useId, useState, type ReactNode } from "react";

interface CollapseProps {
    children: ReactNode;
    title: string;
}

export const Collapse = ({ children, title }: CollapseProps) => {
    const [toggle, setToggle] = useState(false);
    const buttonId = useId();
    const contentId = useId();

    return (
        <div className={styles.collapse}>
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
