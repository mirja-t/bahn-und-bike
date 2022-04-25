

export const addConnectingTrainlines = (trainlineStops, directTrainStopMap, start) => {
    /**
     * Create Object that collects all change stops along indirect lines
     * keyed by indirect trainline
     * {"RB11": Array}
     */ 
    const changeStops = {};
    for(let line in trainlineStops) {
        trainlineStops[line].forEach(s => {
            let currentStop = directTrainStopMap.retrieve(s.stop_id);
            if(currentStop && s.stop_id !== start) {
                let currentLine = changeStops[s.trainline_id];
                if(currentLine) {
                    changeStops[s.trainline_id].push(currentStop)
                }
                else {
                    changeStops[s.trainline_id] = [currentStop]
                }  
            }
        });
    }

    return changeStops

    
}
    