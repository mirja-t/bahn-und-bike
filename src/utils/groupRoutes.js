/**
 * 
 * @param { array } stops 
 * @returns 
 * 
 * returns an array of trainstops related to a trainline
 */
export const groupRoutes = (stops, type='train') => {
    const prop = type==='train' ? 'trainline_id' : 'veloroute_id';

    let line = stops[0][prop];
    let currentLine = true;
    let endIdx = 0;

    while(currentLine && endIdx < stops.length){
        if(stops[endIdx][prop]!==line) {
            currentLine = false;
            break;
        }
        endIdx++
    } 
    return stops.splice(0, endIdx);
}