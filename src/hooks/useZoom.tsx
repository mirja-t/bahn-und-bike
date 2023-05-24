import { useEffect, useState, useRef } from 'react';
import { CurrentTrainroutes, Veloroute } from '../types/types';
import { mapRatio, svgWidth, svgHeight } from '../utils/svgMap';

export const useZoom = (
    journeys: CurrentTrainroutes, 
    vrouteposition: Veloroute, 
    value: number, 
    wrapper: HTMLDivElement,
    mapSize: [number, number],
    userscale: number, 
    loading: boolean
    ) => { 

    userscale = Number(userscale.toFixed(1));
    const [zoom, setZoom] = useState({
        x: 0,
        y: 0,
        scale: userscale,
        containerWidth: mapSize[0],
        containerHeight: mapSize[1],
        longestDist: 0
    });

    const zoomMemo = useRef(zoom);

    useEffect(() => {

        if(loading) return;
        console.log(mapRatio)
        // get shortest size of wrapper
        const wrapperMinSize = Math.min(wrapper?.offsetWidth, wrapper?.offsetHeight) || 1;

        if(value===0) {
            setZoom({
                x: 0,
                y: 0,
                scale: userscale,
                containerWidth: wrapperMinSize * mapRatio,
                containerHeight: wrapperMinSize,
                longestDist: 1
            })
        }
        else {

            // get the farthest distance to the starting point by direction
            const getDistance = (journeys: CurrentTrainroutes, coord: 'x' | 'y') => {
                if(journeys.length === 0) return 0;
                const velorouteDistances: number[] = vrouteposition ? vrouteposition?.route.map(el => el.leg.map(s => s[coord])).reduce((acc, el) => acc.concat(el),[]) : [];
                const trainrouteDistances: number[] = journeys.map(el => el.lastStation[coord]);

                return trainrouteDistances.concat(velorouteDistances).reduce((acc, el) => {
                    return Math.max(Math.abs(el - xStart), acc)
                }, 0);
            }

            // get the journey origin on the map
            const devider = journeys.length > 0 ? journeys.length : 1;
            const xStart = journeys.map(el => el.firstStation.x).reduce((acc, el) => acc + el, 0) / devider;
            const yStart = journeys.map(el => el.firstStation.y).reduce((acc, el) => acc + el, 0) / devider;

            const leftOffset = (svgWidth/2 - xStart) * mapSize[0] / svgWidth;
            const topOffset = (svgHeight/2 - yStart) * mapSize[1] / svgHeight;
            
            let distX: number = getDistance(journeys, 'x');
            let distY: number = getDistance(journeys, 'y');
            distX = !distX ? wrapperMinSize : distX;
            distY = !distY ? wrapperMinSize : distY;

            // get viewport ratio
            const longestDist = Math.max(distX, distY);
            const scale = wrapperMinSize / longestDist;
            

            const currentZoom = {
                x: leftOffset * scale * userscale,
                y: topOffset * scale * userscale,
                scale: scale * userscale,
                containerWidth: mapSize[0] * scale * userscale,
                containerHeight: mapSize[1] * scale * userscale,
                longestDist: longestDist
            }

            setZoom(currentZoom);
            zoomMemo.current = currentZoom;
        }
        
    },[journeys, vrouteposition, value, wrapper, mapSize, userscale, loading]);

    return zoom
}