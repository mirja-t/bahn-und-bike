export const processDestinationData = stops => {

    const stopData = {};
    stops.forEach(s => {
        if(!stopData[s.destination_id]) {
            // destination name w/o 'Bahnhof'
            const indexEnd = s.dest_name.indexOf(', Bahnhof') > 0 ? s.dest_name.indexOf(', Bahnhof') : s.dest_name.length;

            stopData[s.destination_id] = {
                stop_name: s.dest_name.slice(0, indexEnd),
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