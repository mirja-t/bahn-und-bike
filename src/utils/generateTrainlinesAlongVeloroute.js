import { trainlineData } from "./trainlineData";

export const generateTrainlinesAlongVeloroute = (trainlines, stopIds) => {

    const trains = [];
    stopIds.forEach(s => {
      const train = trainlines.find(line => line.route.map(stop => stop.stop_id).includes(s));
      if(!train) return
      let nextStopIndex = train.route.map(stop => stop.stop_id).indexOf(s) + 1;
      if (nextStopIndex < 0) nextStopIndex = train.route.length;

      const trainData = trainlineData(train, nextStopIndex);
      trains.push(trainData)
    });

    return trains;
}