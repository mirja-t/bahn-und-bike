import { useDispatch } from 'react-redux';
import { 
    setActiveSection,
    setTrainLinesAlongVeloroute
} from '../TrainroutesSlice';
import {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setCombinedVeloroute
} from '../../veloroutes/VeloroutesSlice';
import { Trainstop } from '../trainstop/Trainstop';
import { memo } from 'react';


export const Trainroute = memo(function Trainroute({
    item,
    strokeScale,
    className
}) {

    const dispatch = useDispatch();

    const setAdditionalTrainlineActive = (line) => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
        dispatch(setCombinedVeloroute(null))
    }
    
    return (<g 
        className={`${className} routegroup`}
        onClick={() => setAdditionalTrainlineActive(item)}
        >
       <polyline 
            className="route-bg"
            strokeWidth={5 / strokeScale}
            points={item.points} />
        <polyline 
            className={'route'}
            strokeWidth={1 / strokeScale}
            points={item.points}
            style={{
                strokeDashoffset: item.pathLength,
                strokeDasharray: item.pathLength
            }}
            />
        { item && item.lastStation && 
            <Trainstop 
                styles={{scale: 1}}
                item={item.lastStation}
                strokeScale={strokeScale} />}
    </g>)
}, (prev, next) => prev.item.pathLength === next.item.pathLength && prev.className === next.className && prev.strokeScale === next.strokeScale);