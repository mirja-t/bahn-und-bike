const getStopData = arr => { 
    let duracc = 0;
    let getDur = dur => duracc += dur;
    return arr.map(stop => {
        return {
            destination_id: stop.destination_id, 
            x: stop.lon,
            y: stop.lat,
            dur: getDur(stop.dur),
            stop_name: stop.dest_name,
            trainlines: stop.trainlines
        }
    }) 
}

export const allocateTrainstopsToRoute = (trainlineIds, trainstops, start) => {

    const trainlineStartingPoints = [];
    trainlineIds.forEach(id => {
        const startPos = trainstops.filter(stop => start.includes(stop.destination_id))
            .find(stop => stop.trainline_id === id)
        if(startPos) trainlineStartingPoints.push(startPos)
    });

    const trainlines = [];

    for(let startingPoint of trainlineStartingPoints) {

        let currentTrainline = trainstops.filter(stop => stop.trainline_id === startingPoint.trainline_id);
        currentTrainline = currentTrainline.sort((a,b) => a.stop_number - b.stop_number);

        if(startingPoint.stop_number !== 0 && startingPoint.stop_number !== currentTrainline.length - 1){
            const section1 = currentTrainline.slice(0, startingPoint.stop_number + 1);
            section1.reverse();
            trainlines.push({
                line: startingPoint.trainline_id,
                route: getStopData(section1)
            })
            const section2 = currentTrainline.slice(startingPoint.stop_number);
            trainlines.push({
                line: startingPoint.trainline_id,
                route: getStopData(section2)
            })
        }
        else if(startingPoint.stop_number === currentTrainline.length - 1){
            currentTrainline.reverse();
            trainlines.push({
                line: startingPoint.trainline_id,
                route: getStopData(currentTrainline)
            })
        }
        else {
            trainlines.push({
                line: startingPoint.trainline_id,
                route: getStopData(currentTrainline)
            })
        }
        
    }
    return trainlines
}