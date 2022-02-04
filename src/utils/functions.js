// DestinationDetails
// get list of trains that stop at station 
export const getTrainList = (dest, dbRoutes) => dbRoutes.filter(el => {
    return el.route.map(d => d.stop_id).includes(dest)
}).map(el => el.line);

// getJourneys filtered by stopId
export const getRoutes = (stopId, dbRoutes) => {
    if (!dbRoutes || !stopId) return 
    // add trainLine to stops
    Object.entries(dbRoutes).map(el => {
        return el[1].map(stop => stop.line = el[0]) 
    })
    // filter trainlines
    const routeMatch = Object.entries(dbRoutes)
    .filter(route => route[1].find(e => {
        return e.stop_id===stopId
    }))
    .map(el => el[1])
    return routeMatch
}

export const getVeloRoutes = (station, veloroutes) => {
    const section = veloroutes ? veloroutes.stops : [];
    const reducer = (prev, curr) => prev.concat(curr);
    const routeNames = [...new Set(Object.entries(veloroutes).map(d => d[1]).reduce(reducer))];
    const routeStops = routeNames.filter(route => section.map(e => e.split(' ')[0]).includes(route.split(' ')[0]));

    if(station) routeStops.push(...routeNames.filter(route => route.includes(station.split(' ')[0])))

    const vroutes = Object.entries(veloroutes).filter(el => {
        return el[1].find(e => routeStops.includes(e.split(' ')[0]))
    }).map(el => {
        return {
            veloroute: el[0],
            station: section.filter(s => el[1].find(routestop => routestop.includes(s.split(' ')[0])))
        }
    });
    return vroutes
}

// DestinationDetails
export const getTime = (minutes, lang) => {

        const strMinute     = lang === 'de' ? 'Minute' : 'minute';
        const strMinutes    = lang === 'de' ? 'Minuten' : 'minutes';
        const strHour       =  lang === 'de' ? 'Stunde' : 'hour';
        const strHours      =  lang === 'de' ? 'Stunden' : 'hours';
        const getTimeFormat = minutes => {
            if(minutes === 1) return `${minutes} ${strMinute}`;
            if(minutes < 60) {
                return `${minutes} ${strMinutes}`;
            }
            else if (minutes === 60) {
                return `1:00 ${strHour}`;
            }
            else {
                const hrs = Math.floor(minutes / 60);
                let mnts = minutes % 60 < 10 ? '0' + minutes % 60 : minutes % 60;
                mnts = mnts===0 ? '00' : mnts;
                return `${hrs}:${mnts} ${strHours}`;
            }
        }
        const timeFormat = getTimeFormat(minutes);

    return timeFormat
}