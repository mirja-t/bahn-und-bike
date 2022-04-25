import { useEffect, useState, useRef } from 'react';

export const useZoom = (mapcontainerRef, journeys, vrouteposition, value, wrapper, dimensions, userscale, loading) => { 
    userscale = userscale.toFixed(1);

    const [zoom, setZoom] = useState({
        x: 0,
        y: 0,
        scale: userscale,
        containerWidth: dimensions[0],
        containerHeight: dimensions[1],
        longestDist: 0
    });

    const zoomMemo = useRef(zoom);

    useEffect(() => {

        if(loading) return zoomMemo.current
        if(parseInt(value)===0) {
            setZoom({
                x: 0,
                y: 0,
                scale: userscale,
                containerWidth: dimensions[0],
                containerHeight: dimensions[1],
                longestDist: 0
            })
            return
        }

        const shrinkFactor = .9;
        const containerSize = Math.min(wrapper?.offsetWidth, wrapper?.offsetHeight);
        const initScale = wrapper?.offsetWidth / wrapper?.offsetHeight > 16/9 ? wrapper?.offsetWidth / 1920 : wrapper?.offsetHeight / 1080;

        const devider = journeys.length > 0 ? journeys.length : 1;
        const xStart = journeys.map(el => el.firstStation.x).reduce((acc, el) => acc + parseFloat(el), 0) / devider;
        const yStart = journeys.map(el => el.firstStation.y).reduce((acc, el) => acc + parseFloat(el), 0) / devider;

        // get x and y journeys of veloroute stops
        const vroutejourneysX = vrouteposition ? vrouteposition?.route.map(el => el.map(s => s.x)).reduce((acc, el)=>{
            return acc.concat(el)
        },[]) : [];
        const vroutejourneysY = vrouteposition ? vrouteposition?.route.map(el => el.map(s => s.y)).reduce((acc, el)=>{
            return acc.concat(el)
        },[]) : [];

        // get the farthest distance to the starting point by direction
        let distX = journeys.map(el => el.lastStation.x)
            .concat(vroutejourneysX).reduce((acc, el)=>acc.concat(el),[])
            .reduce((acc, el) => {
                return Math.max(Math.abs(el - xStart), acc)
            }, 0);

        let distY = journeys.map(el => el.lastStation.y)
            .concat(vroutejourneysY).reduce((acc, el)=>acc.concat(el),[])
            .reduce((acc, el) => {
                return Math.max(Math.abs(el - yStart), acc)
            }, 0);

        distX = distX < 0.1 ? 0.1 : distX;
        distY = distY < 0.1 ? 0.1 : distY;

        // get viewport ratio
        const longestDist = Math.max(distX, distY);

        const scale = ((containerSize / (longestDist * 2)) * (1 / initScale)) * shrinkFactor;

        const left = ((dimensions[0]/2)-(xStart * initScale)) * scale;
        const top =  ((dimensions[1]/2)-(yStart * initScale)) * scale;

        const currentZoom = {
            x: left * userscale,
            y: top * userscale,
            scale: scale * userscale,
            containerWidth: dimensions[0] * scale * userscale,
            containerHeight: dimensions[1] * scale * userscale,
            longestDist: longestDist
        }

        setZoom(currentZoom);
        zoomMemo.current = currentZoom;
        
    },[mapcontainerRef, journeys, vrouteposition, value, wrapper, dimensions, userscale, loading]);

    return zoom
}