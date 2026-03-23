import styles from "./tooltip.module.scss";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    showOnHover?: boolean;
    permanent?: boolean;
}

export const Tooltip = ({
    children,
    content,
    className,
    showOnHover = true,
    permanent = false,
}: TooltipProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const handleClick = () => {
        if (showOnHover || permanent) return; // Don't toggle on click if showOnHover is true or permanent is true
        setShowTooltip((prev) => !prev);
    };
    const handleClickOutside = useCallback(() => {
        setShowTooltip(false);
    }, []);
    useClickOutside(buttonRef, handleClickOutside);

    return (
        <button
            type="button"
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={() =>
                showOnHover && !permanent && setShowTooltip(true)
            }
            onMouseLeave={() =>
                showOnHover && !permanent && setShowTooltip(false)
            }
            className={`${styles.tooltip} ${className || ""}`}
        >
            {children}
            <div
                className={`${styles.tooltipText} ${showTooltip || permanent ? styles.show : ""}`}
            >
                {content}
            </div>
        </button>
    );
};
