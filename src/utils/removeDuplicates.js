export const removeDuplicates = (trainRoutes) => {
    trainRoutes.sort((a, b) => b.route.length - a.route.length);

    const reducer = arr => arr.reduce((acc, el)=> acc.concat(el),[]);
    const trainLineStopIdsArrCopy = [...new Set(trainRoutes
        .map(trainLineObj => trainLineObj.route.map(trainStop => trainStop.stop_id))
        .reduce(reducer, []))];

    const returnArrayOfTrainStopIds = arr => arr.map(trainStop => trainStop.destination_id);
    const trainlineMatch = trainRoutes.filter((trainLineObj, index) => 
        !(returnArrayOfTrainStopIds(trainLineObj.route).every(trainLineStop => 
            trainLineStopIdsArrCopy.slice(0, index).find(trainLineStopArrCopy => 
                {
                    return trainLineStopArrCopy.includes(trainLineStop)
                })
            )));
    
    return trainlineMatch
}