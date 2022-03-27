export const distributeTrainlines = (velorouteStops, destinations) => {
    velorouteStops.forEach(stop => {
        stop.trainstop = (stop.trainstop && stop.destination_id) ? destinations[stop.destination_id]?.trainlines : null
    })
}