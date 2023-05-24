import { getMapPosition } from './svgMap';

export const refactorStopData = stop => {
    
    // shorten stop name
    const getStopName = dest => {
        if(!dest) return
        // remove ', Bahnhof' from stop_name
        const indexEnd = dest.indexOf(', Bahnhof') > 0 ? dest.indexOf(', Bahnhof') : dest.length;
        return dest.slice(0, indexEnd)
    }

    const refactoredstop = {};
    const [x, y] = getMapPosition(stop.lon, stop.lat);
    try {
        refactoredstop.stop_id = stop.destination_id;
        refactoredstop.stop_name = getStopName(stop.destination_name);
        refactoredstop.stop_number = parseInt(stop.stop_number);
        refactoredstop.lat = parseFloat(stop.lat);
        refactoredstop.lon = parseFloat(stop.lon);
        refactoredstop.x = x;
        refactoredstop.y = y;
        if(stop.trainline_id) refactoredstop.trainline_id = stop.trainline_id;
        if(stop.trainstops) refactoredstop.trainstops = stop.trainstops;
        if(stop.veloroute_id) refactoredstop.veloroute_id = stop.veloroute_id;
        if(stop.dur) refactoredstop.dur = parseInt(stop.dur);
        if(stop.len) refactoredstop.len = parseInt(stop.len);
    }
    catch(e){
        throw new Error('error: ',e)
    }
    return refactoredstop
}