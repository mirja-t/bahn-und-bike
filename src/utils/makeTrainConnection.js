import { getPathLength } from './getPathLength';
import { refactorStopData } from './refactorStopData';
import { groupByKey } from './utils';

/**
 * 
 * @param {array} arr 
 * @returns array
 * {
 * dur: number,
 * line: string[],
 * pathLength: number,
 * lastStation: { stop_name, stop_id, x, y },
 * stopIds: string[],
 * points: string,
 * connection: { stop_name: string, initial_train: {}, connecting_train: {} }
 * }
 */

export function makeTrainConnection(arr) {
    arr = arr.map(refactorStopData);
    const grouped = groupByKey('trainline_id', arr) 
    const connection = {
        firstStation: grouped[0][0],
        lastStation: grouped[grouped.length-1][grouped[grouped.length-1].length-1],
        dur: getConnectionDuration(arr),
        line: grouped.map(line => line[0].trainline_id),
        pathLength: getPathLength(arr),
        points: arr.map(stopdata => `${stopdata.x},${stopdata.y} `).join('')
    }
    return connection
}

function getConnectionDuration(...arr) {
    let dur = 0;
    const reducer = (acc, stop) => acc + Number(stop.dur);
    arr.forEach(array => {
        const sum = array.reduce(reducer, 0);
        dur += sum;
    });
    return dur;
}