
export const refactorVeloroutes = (journeys, destinations) => {

  const stateArr = [];
    journeys.forEach((s, idx) => {
      // destination name w/o 'Bahnhof'
      const indexEnd = s.dest_name.indexOf(', Bahnhof') > 0 ? s.dest_name.indexOf(', Bahnhof') : s.dest_name.length;

      const stop = {
        stop_name: s.dest_name.slice(0, indexEnd),
        stop_id: s.dest_id,
        train_list: destinations[s.dest_id] ? destinations[s.dest_id]?.trainlines : [],
        x: s.lon,
        y: s.lat
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