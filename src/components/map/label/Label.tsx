import "./label.scss";

interface LabelProps<T> {
    item: {
        x: number;
        y: number;
        stop_name: string;
    } & { [key in keyof T]?: T[key] };
    className: string;
    strokeScale: number;
}

export const Label = <T,>({ item, className, strokeScale }: LabelProps<T>) => {
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
