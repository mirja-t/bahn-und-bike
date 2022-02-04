

export const getJourneys = (trainlineIds, trainstops) => { 
    
    const trainroutes = trainlineIds.map(id => {
        return {
            line: id,
            route: []
          }
    });

    const distributeTrainstops = stop => {
        const stop_number = parseInt(stop.stop_number);
        const stopData = {
            destination_id: parseInt(stop.destination_id), 
            pos: [parseFloat(stop.lon), parseFloat(stop.lat)],
            dur: parseInt(stop.dur),
            stop_name: stop.dest_name
        }
        
        trainroutes.find(s => s.line === stop.trainline_id).route[stop_number] = stopData; 
    }
    trainstops.forEach(distributeTrainstops);

    
    return trainroutes
}