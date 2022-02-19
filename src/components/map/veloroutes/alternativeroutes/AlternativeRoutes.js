import './alternativeroute.scss';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import { useRoutePath } from '../../../../hooks/useRoutePath';
import { generateTrainlinesAlongVeloroute } from '../../../../utils/generateTrainlinesAlongVeloroute';
import { 
    selectActiveVelorouteSection,
    selectCrossingVelorouteList,
    selectCrossingVeloroutesLoading,
    setActiveVelorouteSection,
    setCombinedVeloroute
} from "../VeloroutesSlice";
import { 
    setTrainLinesAlongVeloroute,
    selectTrainrouteList
} from '../../trainroutes/TrainroutesSlice';

const AlternativeRoute = ({altroute}) => {

    let {route} = altroute;

    const dispatch = useDispatch();
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const trainrouteList = useSelector(selectTrainrouteList);
    const routePath = useRoutePath(route);
    const [active, setActive] = useState(false);

    route = route.reduce((acc, arr) => acc.concat(arr), [])

    const handleClick = () => {
        dispatch(setCombinedVeloroute(altroute.name))
        dispatch(setActiveVelorouteSection(route))  
        const stopIds = [route[0].stop_id, route[route.length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
    }

    useEffect(()=>{
        const compare = activeVelorouteSection.map(s => s.stop_id).join('')===route.map(s => s.stop_id).join('')
        setActive(compare)
    },[activeVelorouteSection, route]);

    return (<g onClick={handleClick} className={active ? 'active' : ''}>
        <path className="alternativeVeloroute" d={routePath}/>
        <path 
            className="alternativeVeloroute-bg" 
            d={routePath} />
    </g>)
}

export const AlternativeRoutes = () => {
    const crossingVeloroutes = useSelector(selectCrossingVelorouteList);
    const crossingVeloroutesLoading = useSelector(selectCrossingVeloroutesLoading);

    if(crossingVeloroutesLoading) return <g/>
    return crossingVeloroutes.map((route, i) => (<AlternativeRoute key={i} altroute={route} />)) 
}