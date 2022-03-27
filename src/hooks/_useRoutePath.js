import { useEffect, useState } from 'react';

export const useRoutePath = arr => {

    const [routepath, setRoutepath] = useState([]);

    useEffect(()=>{
        if(!arr.length) return []
        const getPos = stop => [stop.x, stop.y]

        const getSegmentPath = path => {
            if(path.length < 1) return ''

            const getBezier = (s, idx) => {
                const distFromPrevToNextPos = {
                    x: (path[idx][0] - path[idx+2][0]) / 4,
                    y: (path[idx][1] - path[idx+2][1]) / 4
                }
                const Qx = s[0] + distFromPrevToNextPos.x;
                const Qy = s[1] + distFromPrevToNextPos.y;
                return `Q${Qx},${Qy}`
            }
            const getMiddle = (s, idx) => `${getBezier(s, idx)} ${s[0]},${s[1]}`;
            const start = `M${path[0][0]},${path[0][1]}`;
            const middle = path.slice(1, path.length-1).map(getMiddle).join(' ');
            const end = `T${path[path.length-1][0]},${path[path.length-1][1]}`
            return start + middle + end
        }
        const pathArr = arr.map(segment => segment.map(getPos)).map(getSegmentPath);
        setRoutepath(pathArr);
    },[arr]);
    return routepath
};