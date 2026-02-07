import "./label.scss";

interface LabelProps {
    item: {
        x: number;
        y: number;
        stop_name: string;
    };
    className: string;
    strokeScale: number;
}

export const Label = ({ item, className, strokeScale }: LabelProps) => {
    return (
        <text
            className={`${className} destinationLabel`}
            x={item.x + 5 / strokeScale}
            y={item.y}
            style={{ fontSize: `${7 / strokeScale}px` }}
        >
            <tspan>{item.stop_name}</tspan>
        </text>
    );
};
