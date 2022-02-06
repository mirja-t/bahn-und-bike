export const processDestinationData = stops => {

    const stopData = {};
    stops.forEach(s => {
        if(!stopData[s.destination_id]) {
            stopData[s.destination_id] = {
                stop_name: s.dest_name,
                stop_id: s.destination_id,
                trainlines: s.trainlines
            }
        }
        else { 
            if (!stopData[s.destination_id].trainlines.includes(s.name)) 
            stopData[s.destination_id].trainlines.push(s.name) 
        }                
    });
    return stopData
}