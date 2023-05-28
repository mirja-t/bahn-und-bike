import { getMapPosition } from './svgMap';
import { removeWords } from './utils';

export const refactorStopData = stop => {
    const wordsToRemove = ['Bahnhof', 'Hbf', 'Hauptbahnhof', 'Bhf', 'S-Bahn', 'Busbahnhof'];
    const refactoredstop = {};
    const [x, y] = getMapPosition(stop.lon, stop.lat);
    try {
        refactoredstop.stop_id = stop.destination_id;
        refactoredstop.stop_name = removeWords(stop.destination_name, wordsToRemove);
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