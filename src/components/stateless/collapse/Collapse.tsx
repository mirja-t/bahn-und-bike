import { useTranslation } from "../../../utils/i18n";
import styles from "./collapse.module.scss";
import { useEffect, useId, useState, type ReactNode } from "react";

interface CollapseProps {
    children: ReactNode;
    title: string;
    variant?: "primary" | "minify";
    open?: boolean;
}

export const Collapse = ({ children, title, variant, open }: CollapseProps) => {
    const { t } = useTranslation();
    const [toggle, setToggle] = useState(Boolean(open));
    const buttonId = useId();
    const contentId = useId();

    useEffect(() => {
        setToggle(Boolean(open));
    }, [open]);

    return (
        <div
            className={`${styles.collapse} ${variant === "minify" ? styles.minify : ""}`}
        >
            <button
                aria-label={title || t("toggle")}
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
