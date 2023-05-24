import { getMapPosition } from './svgMap';

// get PathLength for getDistance
export const getPathLength = (route) => {
    if(!route) return 0 
    const path = route.map(el => getMapPosition(el.lon, el.lat));
    const reducer = (acc, n) => acc + n;
    return path.map((el, idx) => {
        const prev = idx > 0 ? path[idx-1] : el;
        const a = Math.abs(prev[0] - el[0]);
        const b = Math.abs(prev[1] - el[1]);
        return Math.sqrt(a ** 2 + b ** 2)
    }).reduce(reducer, 0);
}