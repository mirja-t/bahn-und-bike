import { getMapPosition } from './svgMap';

export const addXYValues = arr => {
    return arr.map(stop => {
        const [x, y] = getMapPosition(stop.lon, stop.lat);
        return { ...stop, x, y }
    });
}