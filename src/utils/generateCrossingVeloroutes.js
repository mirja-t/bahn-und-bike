import { getRoutePath } from "./getRoutePath";

export const generateCrossingVeloroutes = (activeVelorouteSection, crossingVeloroutes) => {
    const crossingVRoutes = [];

    activeVelorouteSection.forEach((stop, idx) => {
        if(idx === 0 || idx === activeVelorouteSection.length - 1) return

        // find crossing section of crossing veloroute
        const crossingRoutes = crossingVeloroutes.map(route => {
            const segment = route.route.find(segment => segment.map(s => s.stop_id).includes(stop.stop_id))
            return {
                id: route.id,
                name: route.name,
                route: segment
            }
        })
        .filter(segment => segment.route); // removes elements with route: undefined

        crossingRoutes.forEach(crossingRoute => {
            // find junction stop for current velosection stop
            const indexOfJunction = crossingRoute.route.map(s => s.stop_id).indexOf(stop.stop_id);
            let segments = crossingRoute.route;

            if((indexOfJunction !== 0 || indexOfJunction !== segments.length-1) && segments.length > 2){
                segments = [segments.slice(indexOfJunction), segments.slice(0, indexOfJunction + 1).reverse()]
            }
            else {
                if(indexOfJunction===0){
                    segments = [segments]
                }
                else{
                    segments.reverse();
                    segments = [segments]
                }
            }

            segments.forEach(segment => {
                const routes = [[activeVelorouteSection.slice(0, idx+1), segment],[activeVelorouteSection.slice(idx).reverse(), segment]];
                routes.forEach(r => {
                    if(r[0][0].stop_id !== r[1][r[1].length-1].stop_id) crossingVRoutes.push({
                        id: crossingRoute.id,
                        veloroute_name: crossingRoute.name,
                        name: `${r[0][0].stop_name} – ${r[1][r[1].length-1].stop_name}`,
                        route: r,
                        path: getRoutePath(r)
                    })
                })
            })
        })
    })
    return crossingVRoutes
}