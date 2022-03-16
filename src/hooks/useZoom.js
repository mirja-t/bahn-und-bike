import { useEffect, useState } from 'react';
import { svg_scale } from '../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const useZoom = (mapcontainerRef, positions, vrouteposition, value, wrapper, dimensions, userscale) => { 
    userscale = userscale.toFixed(1);

    const [zoom, setZoom] = useState({
        x: 0,
        y: 0,
        scale: userscale,
        containerWidth: dimensions[0],
        containerHeight: dimensions[1],
        longestDist: 0
    });

    useEffect(() => {

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
        const initScale = wrapper?.offsetWidth / wrapper?.offsetHeight > 16/9 ? wrapper?.offsetWidth / 1920 / userscale : wrapper?.offsetHeight / 1080 / userscale;

        const devider = positions.length > 0 ? positions.length : 1;
        const startPosX = positions.map(el => el.route[0].x).reduce((acc, el) => acc + parseFloat(el), 0) / devider;
        const startPosY = positions.map(el => el.route[0].y).reduce((acc, el) => acc + parseFloat(el), 0) / devider;
        
        // get x and y positions of veloroute stops
        const vroutepositionsX = vrouteposition ? vrouteposition?.route.map(el => el.map(s => s.x)).reduce((acc, el)=>{
            return acc.concat(el)
        },[]) : [];
        const vroutepositionsY = vrouteposition ? vrouteposition?.route.map(el => el.map(s => s.y)).reduce((acc, el)=>{
            return acc.concat(el)
        },[]) : [];

        // get the farthest distance to the starting point by direction
        let distX = positions.map(el => el.route[el.route.length-1].x)
            .concat(vroutepositionsX).reduce((acc, el)=>acc.concat(el),[])
            .reduce((acc, el) => {
                return Math.max(Math.abs(el - startPosX), acc)
            }, 0);

        let distY = positions.map(el => el.route[el.route.length-1].y)
            .concat(vroutepositionsY).reduce((acc, el)=>acc.concat(el),[])
            .reduce((acc, el) => {
                return Math.max(Math.abs(el - startPosY), acc)
            }, 0);

        distX = distX < 0.1 ? 0.1 : distX;
        distY = distY < 0.1 ? 0.1 : distY;

        // get viewport ratio
        const longestDist = Math.max(distX * xFactor, distY * yFactor);

        const scale = ((containerSize / (longestDist * 2)) * (1 / initScale)) * shrinkFactor;
        const xStart = startPosX * xFactor + xOffset - 960;
        const yStart = - startPosY * yFactor + yOffset - 540;

        const left = (- xStart) * initScale * scale;
        const top = (- yStart) * initScale * scale;

        setZoom({
            x: left + (left * userscale - left),
            y: top + (top * userscale - top),
            scale: scale,
            containerWidth: dimensions[0] * scale,
            containerHeight: dimensions[1] * scale,
            longestDist: longestDist
        })
        
    },[mapcontainerRef, positions, vrouteposition, value, wrapper, dimensions, userscale]);

    return zoom
}