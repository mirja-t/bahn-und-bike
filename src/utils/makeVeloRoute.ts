/**
 * activeVeloroute
 * id: string, 
 * name: string,
 * len: number,
 * route: { stop_id: string, stop_name: string, x: number, y: number, lat: number, lon: number }[][],
 * path: string
 */

import { removeWords } from "./utils";

const wordsToRemove = ['Bahnhof', 'Hbf', 'Hauptbahnhof', 'Bhf', 'S-Bahn', 'Busbahnhof'];

export const makeVeloRoute = stopsGroup => {
    const route = [];

    stopsGroup.forEach(stops => {
        let currentLeg = [];
        let dist = 0;
        stops.forEach(stop => {
            const routestop = {
                stop_id: stop.id,
                stop_name: removeWords(stop.dest_name, wordsToRemove),
                trainlines: stop.trainlines,
                x: stop.x,
                y: stop.y
            }
            if(stop.trainstop) routestop.trainstop = stop.trainstop;
            if(currentLeg.length) dist += Number(stop.dist);
            currentLeg.push(routestop);
        });
        
        route.push({
            dist: parseFloat(dist.toFixed(2)),
            leg: currentLeg
        });
        dist = 0;
        currentLeg = [];
    });
    return route
}

export const groupVeloroute = (stops, trainlines) => {

    let currentLeg = [];
    const route = [];

    stops.forEach((stop, idx) => {
        currentLeg.push(stop);
        if(idx === stops.length-1) {
            route.push(currentLeg);
        }
        else if(stop.trainlines !== null && currentLeg.length > 1) {
            if(trainlines && !stop.trainlines.some(trainline => trainlines.includes(trainline))) return;
            route.push(currentLeg);
            currentLeg = [stop];
        }
        
    });
    return route
}

export const makeTrainlinesArray = stops => {
    stops.forEach(stop => {
        if(stop.trainlines) stop.trainlines = stop.trainlines.split(',');
    });
    return stops
}