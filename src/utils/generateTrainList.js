export const generateTrainList = (trainlines) => {
    const trainlineList = {}
    
    for(let line in trainlines){
        trainlines[line].forEach(s => {
            const prev = trainlineList[s.stop_id];
            trainlineList[s.stop_id] = prev ? [...prev, {trainline_id: s.trainline_id, name: s.name}] : [{trainline_id: s.trainline_id, name: s.name}];
        });
    }

    return trainlineList
}