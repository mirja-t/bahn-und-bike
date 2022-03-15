export const getStopData = async(route) => {

    const addStopPos = async(id) => {

        const stopData = await fetch(`https://bahn-und-bike:8890/database/index.php/stop?id=${id}`)
            .then(response => response.json())
            .then(responseJSON => {
                if(!responseJSON[0]) throw Error('error' + responseJSON[0])
                return responseJSON[0]
            });
        return [stopData.lon, stopData.lat]
    }

    const routeWithPos = [];
    const getRoutePositions = async() => {
        for (let stop of route) {
            let pos = await addStopPos(stop.stop_id);
            stop.x = pos[0];
            stop.y = pos[1];
            routeWithPos.push(stop)
        }
    }

    await getRoutePositions();

    return routeWithPos
}