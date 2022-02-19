
export const generateCrossingVeloroutes = (activeVelorouteSection, crossingVeloroutes) => {

    const alternativeRoutes = [];

    activeVelorouteSection.forEach((stop, idx) => {
        if(idx === 0 || idx === activeVelorouteSection.length - 1) return
        const altRoutes = crossingVeloroutes.map(route => {
            const segment = route.route.find(segment => segment.map(s => s.stop_id).includes(stop.stop_id))
            return {
                id: route.id,
                name: route.name,
                route: segment
            }
        }).filter(segment => segment.route)
        altRoutes.forEach(alternativeRoute => {
            const index = alternativeRoute.route.map(s => s.stop_id).indexOf(stop.stop_id);
            let segments = alternativeRoute.route;

            if(index !== 0 || index !== segments.length-1){
                segments = [segments.slice(index), segments.slice(0, index + 1).reverse()]
            }
            else {
                if(index===0){
                    segments = [segments]
                }
                else{
                    segments.reverse();
                    segments = [segments]
                }
            }
           
            segments.forEach(segment => {
                const route = [activeVelorouteSection.slice(0, idx+1), segment];
                const altRoute = {
                    id: alternativeRoute.id,
                    name: alternativeRoute.name,
                    route: route
                }
                alternativeRoutes.push(altRoute)
            })
        })
    })
    return alternativeRoutes
}