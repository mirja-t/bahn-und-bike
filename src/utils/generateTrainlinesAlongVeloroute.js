import { getPathLength } from './getPathLength';

export const generateTrainlinesAlongVeloroute = (trainlines, stopIds) => {

    stopIds = stopIds.map(id => parseInt(id));
    const trains = trainlines.filter(t => t.route.map(r => r.destination_id).find(d => stopIds.includes(d)));
    
    const routes = trains.map(journey => {
      const lastStop = journey.route.find(s => stopIds.includes(s.destination_id));
      let lastStopIndex = journey.route.indexOf(lastStop);
      if (lastStopIndex < 0) lastStopIndex = journey.route.length;
    
      return {
        dur: journey.route[lastStopIndex].dur,
        line: journey.line,
        pathLength: getPathLength(journey.route),
        route: journey.route.slice(0, lastStopIndex + 1)
      }
    })
    return routes;
}