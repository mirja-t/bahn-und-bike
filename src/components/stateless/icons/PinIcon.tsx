import "./pins.scss";
import { type ReactNode } from "react";

interface PinIconProps {
    children: ReactNode;
    size?: string;
}

export const PinIcon = ({ children, size }: PinIconProps) => {
    return (
        <div className={size === "small" ? "pin small" : "pin"}>
            <div className="pinicon">{children}</div>
        </div>
    );
};
