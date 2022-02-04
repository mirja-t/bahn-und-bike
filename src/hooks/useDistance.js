import { useEffect, useState } from 'react';

export const useDistance = (section) => {
    const [dist, setDist] = useState(null);

    useEffect(()=>{
        if(!section) return

        const measure = (lat1, lon1, lat2, lon2) => {
            const R = 6378.137; // Radius of earth in KM
            const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
            const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = R * c;
            return d
        }

        const setDistance = (s) => {
            const distances = s.slice(1).map((p, idx) => {
                return measure(s[idx].pos[1], s[idx].pos[0], p.pos[1], p.pos[0])
            });
            return distances.reduce((acc, d) => acc + d)
        }
       
        const d = Math.round(setDistance(section));
        if(typeof d !== 'number') console.log("typeof d !== 'number'", d)
        setDist(d);

    },[section])

    return dist
}
