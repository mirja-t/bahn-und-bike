import "./collapse.scss";
import { useState, type ReactNode } from "react";

interface CollapseProps {
    children: ReactNode;
    title: string;
}

export const Collapse = ({ children, title }: CollapseProps) => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="collapse">
            <h5
                onClick={() => setToggle((prev) => !prev)}
                className={toggle ? "toggle on" : "toggle off"}
            >
                {title}
            </h5>
            <div
                className={
                    toggle ? "toggle-container on" : "toggle-container off"
                }
            >
                {children}
            </div>
        </div>
    );
};
