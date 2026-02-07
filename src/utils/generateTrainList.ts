export const generateTrainList = (trainlines) => {
    /**
     * receives an object with trainline ids
     * returns an object with destination ids
     * 
     * trainlines structure
     * {
     *   trainline_id: [{ dur, lat, lon, name, stop_id, stop_name, stop_number, trainline_id, x, y }, {...}]
     * }
     * 
     * trainlineList structure
     * {
     *   destination_id: [{trainline_id, name}, {...}]
     * }
     */
    
    const trainlineList = {}
    
    for(let line in trainlines){
        trainlines[line].forEach(s => {
            const prev = trainlineList[s.stop_id];
            trainlineList[s.stop_id] = prev ? [...prev, s.name] : [s.name];
        });
    }

    return trainlineList
}