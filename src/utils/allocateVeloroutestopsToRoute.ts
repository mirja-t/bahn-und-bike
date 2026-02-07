

import { getRoutePath } from './getRoutePath';
import { groupRoutes } from './groupRoutes';

export const allocateVeloroutestopsToRoute = (stops, destinations) => {
  const veloroutes = [];
  const velorouteStops = {};
  while(stops.length){
      const veloStops = groupRoutes(stops, 'bike');
      velorouteStops[veloStops[0].veloroute_id] = veloStops;
  }

  for(let route in velorouteStops){
    const currentRoute = {
      id: velorouteStops[route][0].veloroute_id,
      name: velorouteStops[route][0].name,
      len: velorouteStops[route][0].len,
      route: [[]]
    }
    velorouteStops[route].forEach((s, idx) => {
      const stop = {
        stop_id: s.stop_id,
        stop_name: s.stop_name,
        x: s.x,
        y: s.y,
        lat: s.lat,
        lon: s.lon
      }
      currentRoute.route[currentRoute.route.length-1].push(stop)
      if(destinations[s.stop_id] && idx > 0 && idx < velorouteStops[route].length-1) {
        stop.trainstops = destinations[s.stop_id];
        currentRoute.route[currentRoute.route.length] = [stop];
      }
    });
    currentRoute.path = getRoutePath(currentRoute.route);
    currentRoute.route = currentRoute.route.filter(r => r.length > 1)
    veloroutes.push(currentRoute)
  }

  return veloroutes
}