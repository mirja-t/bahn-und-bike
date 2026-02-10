import { germanyBounds, SvgMapBuilder } from "./svgMap";

export const addXYValues = (arr: { lon: number; lat: number }[]) => {
    return arr.map((stop) => {
        const [x, y] = SvgMapBuilder.getMapPosition(
            stop.lon,
            stop.lat,
            germanyBounds,
        );
        return { ...stop, x, y };
    });
};
