const getDuration = (arr) => { 
    let duracc = 0;
    let getDur = dur => duracc += dur;
    return arr.map(stop => {
        return { 
            ...stop,
            dur: getDur(stop.dur)
        }
    }) 
}

export const allocateTrainstopsToRoute = (trainlineIds, trainstops, start) => {
    const trainlineStartingPoints = [];

    trainlineIds.forEach(id => {
        const startPos = trainstops.filter(stop => start.includes(stop.stop_id))
            .find(stop => stop.trainline_id === id)
        if(startPos) trainlineStartingPoints.push(startPos)
    });

    const trainlines = [];
    for(let startingPoint of trainlineStartingPoints) {

        let currentTrainline = trainstops.filter(stop => stop.trainline_id === startingPoint.trainline_id);
        currentTrainline = currentTrainline.sort((a,b) => a.stop_number - b.stop_number);

        // if start is in the middle of route route is splitted and 1st section reversed
        if(startingPoint.stop_number !== 0 && startingPoint.stop_number !== currentTrainline.length - 1){
            currentTrainline = [
                currentTrainline.slice(0, startingPoint.stop_number + 1).reverse(), 
                currentTrainline.slice(startingPoint.stop_number)
            ];            
        }
        else if(startingPoint.stop_number === currentTrainline.length - 1){
            currentTrainline = [currentTrainline.reverse()];
        }
        else {
            currentTrainline = [currentTrainline];
        }
        currentTrainline.forEach(section => {
            trainlines.push({
                line: startingPoint.name,
                route: getDuration(section)
            })
        })
    }
    return trainlines.filter(l => l.route.length > 1)
}