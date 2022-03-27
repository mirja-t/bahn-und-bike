import { getPathLength } from "./getPathLength";
import { svg_scale } from '../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const trainlineData = (train, nextStopIndex) => {
    return {
        dur: train.route[nextStopIndex-1].dur,
        line: train.line,
        pathLength: getPathLength(train.route),
        stopIds: train.route
            .slice(0, nextStopIndex)
            .map(stop => stop.stop_id),
        points: train.route
            .slice(0, nextStopIndex)
            .map(stop => [stop.lon * xFactor + xOffset, - stop.lat * yFactor + yOffset]).join(' '),
        firstStation: {
            stop_name: train.route[0].stop_name,
            stop_id: train.route[0].stop_id,
            x: train.route[0].lon * xFactor + xOffset,
            y: - train.route[0].lat * yFactor + yOffset,
        },
        lastStation: {
            stop_name: train.route[nextStopIndex-1].stop_name,
            stop_id: train.route[nextStopIndex-1].stop_id,
            x: train.route[nextStopIndex-1].lon * xFactor + xOffset,
            y: - train.route[nextStopIndex-1].lat * yFactor + yOffset
        }
    }
}