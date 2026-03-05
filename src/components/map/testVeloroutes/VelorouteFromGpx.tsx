import { createPolylines } from "./createPolylines";
import { polylines } from "./data/polylines";

interface VelorouteFromGpxProps {
    strokeScale: number;
    jsonFileName?: string;
    className?: string;
    strokeWidth?: number;
    strokeColor?: string;
}

export const VelorouteFromGpx: React.FC<VelorouteFromGpxProps> = ({
    strokeScale = 1,
}) => {
    return polylines
        .map(createPolylines)
        .map((route) => (
            <polyline
                key={route}
                className={"velo-route"}
                strokeWidth={1 / strokeScale}
                fill="transparent"
                stroke="green"
                points={route}
            />
        ));
};
