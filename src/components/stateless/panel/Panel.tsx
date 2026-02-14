import "./panel.scss";

interface PanelProps {
    children: React.ReactNode;
}

export const Panel = ({ children }: PanelProps) => {
    return <div className="panel-wrapper">{children}</div>;
};
