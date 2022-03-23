import { useState } from 'react';
import { useRoutePath } from '../../../../hooks/useRoutePath';
import { VelorouteStop } from '../velorouteStop/VelorouteStop';
import { VeloroutePath } from "../veloroutePath/veloroutePath";

export const AlternativeRoute = ({altroute, strokeScale}) => {
    let {route} = altroute;
    const routePath = useRoutePath(route);
    const [hoverDest, setHoverDest] = useState(null);

    route = route.reduce((acc, arr) => acc.concat(arr), [])

    const hoverVeloStop = ({type}, spot) => {
        type === 'mouseenter' ? setHoverDest(spot) : setHoverDest(null);
    }

    return (<>
        <VeloroutePath
            idx={1}
            path={routePath}
            strokeScale={strokeScale}
            active={true}/>

        {[route[0], route[route.length-1]].map((item, idx) => (
            <VelorouteStop 
                key={idx}
                item={item}
                activeSpot={hoverDest}
                strokeScale={strokeScale}
                fn={hoverVeloStop}
                type="active"/>
        ))}
    </>)
}