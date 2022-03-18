export const distributeTrainlines = stops => {
    stops.forEach(stop => {
        stop.stop_number = parseInt(stop.stop_number);
        stop.lat = parseFloat(stop.lat);
        stop.lon = parseFloat(stop.lon);
        stop.dur = parseInt(stop.dur);
        const trainlineList = stops.filter(s => stop.destination_id === s.destination_id).map(s => s.name);
        stop.trainlines = !stop.trainlines ? trainlineList : stop.trainlines;
    });
}