import { svg_scale } from '../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const refactorStopData = stops => {
    // shorten stop name
    const getStopName = dest => {
        // remove ', Bahnhof' from stop_name
        const indexEnd = dest.indexOf(', Bahnhof') > 0 ? dest.indexOf(', Bahnhof') : dest.length;
        return dest.slice(0, indexEnd)
    }

    let refactoredstops = stops.map(stop => {
        return {
            stop_id: stop.destination_id || stop.dest_id,
            stop_name: getStopName(stop.dest_name),
            stop_number: parseInt(stop.stop_number),
            lat: parseFloat(stop.lat),
            lon: parseFloat(stop.lon),
            dur: parseInt(stop.dur),
            len: stop.len,
            trainline_id: stop.trainline_id,
            trainstops: stop.trainstop,
            name: stop.name,
            veloroute_id: stop.veloroute_id,
            x: stop.lon * xFactor + xOffset,
            y: - stop.lat * yFactor + yOffset
        }
        
    });
    return refactoredstops
}