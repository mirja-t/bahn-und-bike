import { getPathLength } from './getPathLength';

export const generateTrainlinesAlongVeloroute = (trainlines, stopIds) => {

    const trains = [];
    stopIds.forEach(s => {
      const train = trainlines.find(line => line.route.map(stop => stop.destination_id).includes(s));
      if(!train) return
      let idx = train.route.map(stop => stop.destination_id).indexOf(s);
      if (idx < 0) idx = train.route.length;
      trains.push({
        dur: train.route[idx].dur,
        line: train.line,
        pathLength: getPathLength(train.route),
        route: train.route.slice(0, idx + 1)
      })
    });

    return trains;
}