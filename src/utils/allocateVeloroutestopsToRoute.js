

import { getRoutePath } from './getRoutePath';

export const allocateVeloroutestopsToRoute = (velorouteStops, destinations) => {
  const veloroutes = [];
  velorouteStops.forEach(stop => {
    const currentRoute = veloroutes.find(obj => obj.id === stop.veloroute_id);

    if(stop.trainstops) {
      // replace string with single trainstop stop_id with array of available trainstops
      stop.trainstops = destinations[stop.stop_id]?.trainlineList ? destinations[stop.stop_id]?.trainlineList : [];
    }

    if(!currentRoute) {
      const newroute = {
        id: stop.veloroute_id,
        name: stop.name,
        len: stop.len,
        route: [[stop]]
      }
      veloroutes.push(newroute)
    }
    else { 
      currentRoute.route[currentRoute.route.length-1].push(stop)
      // new route section if trainstop array not empty and stop is not last/second last stop
      if(stop.trainstops) currentRoute.route[currentRoute.route.length] = [stop]
    }
  });

  veloroutes.forEach(route => {
    route.path = getRoutePath(route.route);
    route.route = route.route.filter(r => r.length > 1)
  })

  return veloroutes
}