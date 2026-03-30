import { useSelector } from "react-redux";
import { selectAppZoom } from "../../../AppSlice";
import styles from "./label.module.scss";

interface LabelProps<T> {
    item: {
        x: number;
        y: number;
        stop_name: string;
    } & { [key in keyof T]?: T[key] };
    className: "train" | "veloroute";
}

export const Label = <T,>({ item, className }: LabelProps<T>) => {
    const appZoom = useSelector(selectAppZoom);
    return (
        <text
            className={`${styles.destinationLabel}${
                className === "veloroute" ? ` ${styles.veloroute}` : ""
            }`}
            x={item.x + 5 / appZoom}
            y={item.y}
            style={{ fontSize: `${10 / appZoom}px` }}
        >
            <tspan>{item.stop_name}</tspan>
        </text>
    );
};
