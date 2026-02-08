import React from "react";
import "./panel.scss";

interface PanelProps {
    children?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ children }) => {
    return <div className="panel-wrapper">{children}</div>;
};
