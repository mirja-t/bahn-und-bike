export const splitJourney = (start, journey) => {

    const {route} = journey;
    const startIndex = route.indexOf(route.find(s => start.includes(s.destination_id)));

    const reverseRoute = r => {
        let reversedRoute = r.map(a => {return {...a}})
        reversedRoute.forEach((s,i) => reversedRoute[Math.max(0, i-1)].dur = s.dur);
        reversedRoute[reversedRoute.length-1].dur = 0;
        reversedRoute.reverse();
        return reversedRoute
    }
    const addDuration = r => {
        let routeWithCulmDur = r.map(a => {return {...a}})
        routeWithCulmDur.forEach((s, i) => s.dur += routeWithCulmDur[Math.max(0, i-1)].dur);
        return routeWithCulmDur
    }
    if (startIndex === 0) {
        journey.route = addDuration(route)
        return journey
    }
    else if (startIndex === route.length-1) {
        const reversedRoute = reverseRoute(route);
        journey.route = addDuration(reversedRoute);
        return journey
    }
    else {
        const sections = [reverseRoute(route.slice(0, startIndex + 1)), route.slice(startIndex)];
        sections[1][0].dur = 0;
        const splitRoute = [];
        const pushRoute = r => {
            const j = {
                line: journey.line,
                route: []
            }
            if (!r.every(s => start.includes(s.destination_id))) {
                j.route = addDuration(r);
                splitRoute.push(j)
            }
        }
        sections.forEach(pushRoute)
        return splitRoute
    }
}