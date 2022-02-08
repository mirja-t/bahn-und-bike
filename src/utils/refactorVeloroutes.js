
export const refactorVeloroutes = (journeys, destinations) => {

  const stateArr = [];
    journeys.forEach((s, idx) => {

      const stop = {
        stop_name: s.dest_name,
        stop_id: s.dest_id,
        train_list: destinations[s.dest_id] ? destinations[s.dest_id]?.trainlines : [],
        pos: [s.lon, s.lat]
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
        if(s.trainstop && idx < journeys.length-1) currentRoute.route[currentRoute.route.length] = [stop]
      }
    });

    return stateArr
  }