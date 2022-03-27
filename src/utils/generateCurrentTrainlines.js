import { trainlineData } from './trainlineData';

export const generateCurrentTrainlines = (trainlines, value) => {
        
    if(parseInt(value)===0) return [];
    const maxDur = value * 30;
    let routes = trainlines.map(train => {
      const nextStop = train.route.find(s => s.dur > maxDur);
      let nextStopIndex = train.route.indexOf(nextStop);
      if (nextStopIndex < 0) nextStopIndex = train.route.length;

      return trainlineData(train, nextStopIndex);
    })
    .sort((a,b) => b.stopIds.length - a.stopIds.length)
    .filter((route, idx, arr) => {
      const prevIds = arr.slice(0, idx).map(r => r.stopIds.join());
      const currentIds = route.stopIds.join();
      return !(prevIds.find(r => r.includes(currentIds)) !== undefined)
    })
    return routes;
}