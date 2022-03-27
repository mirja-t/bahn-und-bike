

import { getRoutePath } from './getRoutePath';
import { svg_scale } from '../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const refactorVeloroutes = (velorouteStops) => {
  const stateArr = [];
    velorouteStops.forEach((s, idx) => {
      // destination name w/o 'Bahnhof'
      const indexEnd = s.dest_name.indexOf(', Bahnhof') > 0 ? s.dest_name.indexOf(', Bahnhof') : s.dest_name.length;

      const stop = {
        stop_name: s.dest_name.slice(0, indexEnd),
        stop_id: s.dest_id,
        train_list: s.trainstop,
        lon: s.lon,
        lat: s.lat,
        x: s.lon * xFactor + xOffset,
        y: - s.lat * yFactor + yOffset,
      }
      const currentRoute = stateArr.find(obj => obj.id === s.veloroute_id);
      if(!currentRoute) {
        const newroute = {
          id: s.veloroute_id,
          name: s.name,
          len: s.len,
          route: [[stop]]
        }
        stateArr.push(newroute)
      }
      else { 
        currentRoute.route[currentRoute.route.length-1].push(stop)
        // new route section if trainstop array not empty and stop is not last/second last stop
        if(s.trainstop && idx < velorouteStops.length-1) currentRoute.route[currentRoute.route.length] = [stop]
      }
    });

    stateArr.forEach(route => {
      route.path = getRoutePath(route.route)
    })
    return stateArr
  }