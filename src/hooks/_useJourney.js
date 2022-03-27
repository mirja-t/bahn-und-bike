import { useEffect, useState } from 'react';
import { svg_scale } from '../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const useJourney = (positions) => {

    const [journey, setJourney] = useState([]);

    useEffect(()=>{

        const p = positions.map(el => {

            return {
                pathLength: el.pathLength,
                route: el.route.map(stop => `${(stop.x * xFactor + xOffset)}, ${( - stop.y * yFactor + yOffset)} `),
                line: el.line,
                dur: el.dur,
                stopIds: el.route.map(el => el.destination_id),
                firstStation: {
                    stop_name: el.route[0].stop_name,
                    stop_id: el.route[0].destination_id
                },
                lastStation: {
                    stop_name: el.route[el.route.length-1].stop_name,
                    stop_id: el.route[el.route.length-1].destination_id,
                    x: el.route[el.route.length-1].x * xFactor + xOffset,
                    y: - el.route[el.route.length-1].y * yFactor + yOffset,
                }
            }
        })

        setJourney(p)
    },[positions])

    return journey
}
