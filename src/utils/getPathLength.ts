import { germanyBounds, SvgMapBuilder } from "./svgMap";

// get PathLength for getDistance
export const getPathLength = (route: { lon: number; lat: number }[]) => {
    if (!route) return 0;
    const path = route.map((el) =>
        SvgMapBuilder.getMapPosition(el.lon, el.lat, germanyBounds),
    );
    return path
        .map((el, idx) => {
            const prev = idx > 0 ? path[idx - 1] : el;
            const a = Math.abs(prev[0] - el[0]);
            const b = Math.abs(prev[1] - el[1]);
            return Math.sqrt(a ** 2 + b ** 2);
        })
        .reduce((acc, n) => acc + n, 0);
};
export function getPathLengthFromPoints(path: string) {
    return path
        .split(" ")
        .slice(0, -1)
        .map((point) => point.split(",").map(Number))
        .map((el, idx, arr) => {
            const prev = idx > 0 ? arr[idx - 1] : el;
            const a = Math.abs(prev[0] - el[0]);
            const b = Math.abs(prev[1] - el[1]);
            return Math.sqrt(a ** 2 + b ** 2);
        })
        .reduce((acc: number, n: number) => acc + n, 0);
}
