export const removeDuplicates = (trainRoutes) => {

    const trainRouteStopIds = trainRoutes
        .map(trainLineObj => trainLineObj.route.map(trainStop => trainStop.destination_id))
        .sort((a, b) => b.length - a.length)
        .map(arr => arr.join(', '));
        

    const duplicateIndexes = []
    for(let i = 0; i < trainRouteStopIds.length; i++){
        if(i===0) continue;
        let duplicate = false;
        for(let j = 0; j < i; j++){
            if(duplicate) continue;
            if(trainRouteStopIds[j].includes(trainRouteStopIds[i])) {
                duplicateIndexes.push(i);
                duplicate = true;
            }
        }
    }

    for(let i = duplicateIndexes.length-1; i >= 0; i--){
        trainRoutes.splice(i, 1)
    }

    return trainRoutes
}