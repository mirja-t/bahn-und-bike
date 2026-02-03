import { 
    Trainlines 
} from './TrainlineTree';
import { HashMap } from '../HashMap/HashMap';
import { addConnectingTrainlines } from './addConnectingTrainlines';
import { getMapPosition } from "../svgMap";

export const generateTrainlineTree = (trainlineStops, startStops, value, direct) => {
    const getFirstStop = (startStops) => {
        const [x, y] = getMapPosition(startStops[0].lon, startStops[0].lat);
        return {
            dur: 0,
            trainlines: [{id: startStops[0].trainline_id, name: startStops[0].name }],
            pathLength: 0,
            stop_ids: [startStops[0].stop_id],
            points: `${x},${y} `,
            stop_name: startStops[0].stop_name,
            stop_number: 0,
            stop_id: startStops[0].stop_id,
            lat: startStops[0].lat,
            lon: startStops[0].lon,
            x,
            y
        };
    }

    /**
     *  1. Init route instance
     *  with root stop
     */
    const initialStopsLength = 500//stops.length;
    const trainlineTree = new Trainlines(getFirstStop(startStops));

    /**
     *  2. Create map with direct trainlines
     *  that holds start indexes as values
     *  {"RB10" => 2}
     */
     const directTrainlinesIndexMap = new Map();
     startStops.forEach(s => {
        directTrainlinesIndexMap.set(s.trainline_id, s.stop_number)
     });

     /**
     * 3. Create a hashmap for all stops of direct trainlines 
     * keyed by stop ids of direct trainlines that store a related stop
     * Add direct trainlines to routes
     * {key: 'BRB8012944', value: {…}}
     */  
     const directTrainStopMap = new HashMap(Math.floor(initialStopsLength / 5))
     directTrainlinesIndexMap.forEach((startIndex, trainline) => {
         const trainStops = trainlineStops[trainline];
         trainStops.forEach(s =>{
             if(s.stop_id !== startStops[0].stop_id){
                directTrainStopMap.assign(s.stop_id, s);
             }
         });
         trainlineTree.addTrainlines(trainStops, startIndex);
         delete trainlineStops[trainline]
     });

     if(!direct){
        /**
         * Add connectiong trainlines
         * 
         * 
         */
        const changeStops = addConnectingTrainlines(trainlineStops, directTrainStopMap, startStops[0].stop_id);
        for(let indirectLine in changeStops){
            const connections = changeStops[indirectLine];
            connections.forEach(change => {
                const trainstops = [...trainlineStops[indirectLine]];
                const stopNumber = trainstops.find(s => s.stop_id === change.stop_id).stop_number;
                trainlineTree.addIndirectTrainline(change, trainstops, stopNumber);
            });
        }
     }


    trainlineTree.getCurrentRoute(parseInt(value) * 30);
    //const trainrouteTree = trainlineTree.trainlines;
    const currentTrainroutes = trainlineTree.journeys;
    return currentTrainroutes;
}
