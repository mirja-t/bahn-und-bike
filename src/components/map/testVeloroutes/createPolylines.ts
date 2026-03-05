import { germanyBounds, SvgMapBuilder } from "../../../utils/svgMap";

export const createPolylines = (data: string) =>
    data
        .split(" ")
        .map((coord) => {
            const [lat, lon] = coord.split(",").map(Number);
            const [x, y] = SvgMapBuilder.getMapPosition(
                lon,
                lat,
                germanyBounds,
            );
            return `${x},${y}`;
        })
        .join(" ");
