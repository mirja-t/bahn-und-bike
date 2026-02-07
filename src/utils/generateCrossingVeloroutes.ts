import { getRoutePath } from "./getRoutePath";
import { v4 as uuidv4 } from 'uuid';

export const generateCrossingVeloroutes = (activeVelorouteSection, crossingVeloroutes) => {
    const crossingVRoutes = [];

    activeVelorouteSection.forEach((stop, idx) => {
        // combinations not for start and endpoints of section
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

            if((indexOfJunction !== 0 || indexOfJunction !== crossingRoute.route.length-1) && crossingRoute.route.length > 1){
                
                const original1 = activeVelorouteSection.slice(0,idx+1);
                const original2 = activeVelorouteSection.slice(idx).reverse();
                const crossing1 = crossingRoute.route.slice(0, indexOfJunction+1).reverse();
                const crossing2 = crossingRoute.route.slice(indexOfJunction);

                [crossing1, crossing2].forEach(crossingSegment => {

                    const routes = []
                    const duplicate = crossingSegment.slice(0,2).every((s, idx) => s.stop_id===original1[original1.length-1-idx].stop_id) || crossingSegment.slice(0,2).every((s, idx) => s.stop_id===original2[original2.length-1-idx].stop_id);
                    const noTrainStation = !crossingSegment[crossingSegment.length-1].trainstops;
                    const roundTour = original1[0].stop_id ===crossingSegment[crossingSegment.length-1].stop_id || original2[0].stop_id ===crossingSegment[crossingSegment.length-1].stop_id;

                    !duplicate && !roundTour && !noTrainStation && original1.length && routes.push(original1);
                    !duplicate && !roundTour && !noTrainStation && original2.length && routes.push(original2);
                    
                    routes.forEach(route =>{

                        route = route.concat(crossingSegment.slice(1));

                        crossingVRoutes.push({
                            id: uuidv4(),
                            route_id: crossingRoute.id,
                            veloroute_name: crossingRoute.name,
                            name: `${route[0].stop_name} – ${route[route.length-1].stop_name}`,
                            route: route,
                            path: getRoutePath([route])
                        });
                    });
                });
            }
        });
    });
    return crossingVRoutes
}