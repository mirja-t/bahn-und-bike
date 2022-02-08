import { getPathLength } from './getPathLength';
import { removeDuplicates } from './removeDuplicates';

export const generateCurrentTrainlines = (trainlines, value) => {
        
    if(parseInt(value)===0) return [];

    const maxDur = value * 30;
    let routes = trainlines.map(journey => {
      const nextStop = journey.route.find(s => s.dur > maxDur)
      let nextStopIndex = journey.route.indexOf(nextStop);
      if (nextStopIndex < 0) nextStopIndex = journey.route.length;

      return {
        dur: journey.route[nextStopIndex-1].dur,
        line: journey.line,
        pathLength: getPathLength(journey.route),
        route: journey.route.slice(0, nextStopIndex)
      }
    })
    routes = removeDuplicates(routes);

    return routes;
}