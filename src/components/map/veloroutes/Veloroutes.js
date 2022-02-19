import './veloroutes.scss';
import { animated, useTransition } from 'react-spring';
import { 
    useDispatch,
    useSelector 
} from 'react-redux';
import {     
    loadCrossingVeloroutes,
    setActiveVelorouteSection,
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    setActiveVelorouteStop,
    selectActiveVelorouteStop,
    setCombinedVeloroute
} from './VeloroutesSlice';
import {
    selectTrainrouteList,
    setTrainLinesAlongVeloroute
} from '../trainroutes/TrainroutesSlice';
import { useRoutePath } from '../../../hooks/useRoutePath';
import { ActiveVelorouteSectionDetails } from './activeVelorouteSectionDetails/ActiveVelorouteSectionDetails';
import { generateTrainlinesAlongVeloroute } from '../../../utils/generateTrainlinesAlongVeloroute';
import { AlternativeRoutes } from './alternativeroutes/AlternativeRoutes';

import { svg_scale } from '../../../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const Veloroutes = ({strokeScale}) => {

    const dispatch = useDispatch();
    const trainrouteList = useSelector(selectTrainrouteList);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const routePaths = useRoutePath(activeVeloroute.route);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);

    const setVelorouteSectionActive = idx => {
        const activeVRoute = activeVeloroute.route[idx];
        const routeIds = activeVRoute.map(stop => stop.stop_id);
        dispatch(setActiveVelorouteSection(activeVRoute))  
        const stopIds = [activeVRoute[0].stop_id, activeVRoute[activeVRoute.length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
        dispatch(loadCrossingVeloroutes(routeIds))
        dispatch(setCombinedVeloroute(null))
    }

    const hoverVeloStop = ({type}, id) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(id)) : dispatch(setActiveVelorouteStop(null))
    }

    const spotTransitions = useTransition(
        activeVelorouteSection ? [activeVelorouteSection[0], activeVelorouteSection[activeVelorouteSection.length-1]] : [],
        {
          from: { scale: 0 },
          leave: { scale: 0 },
          enter: { scale: 1 }
        });

    return (<g 
        className="veloroute" > 
        
        { routePaths.map((path, idx) => (
            <g key={idx}
            onClick={() => {setVelorouteSectionActive(idx)}}>
            <path 
                strokeWidth={activeVelorouteSection===activeVeloroute.route[idx] ? 1.35 / strokeScale : 1 / strokeScale}
                className={activeVelorouteSection===activeVeloroute.route[idx] ? 'veloroute-section active' : 'veloroute-section'}
                d={path} />
            <path 
                strokeWidth={12 / strokeScale}
                className="veloroute-section-large"
                d={path} />
            </g>
        
        ))}
        { spotTransitions((styles, stop, t, idx) => (
            <animated.circle
                key={idx}
                strokeWidth={1 / strokeScale}
                className="veloroute-station"
                cx={stop.pos[0] * xFactor + xOffset}
                cy={ - stop.pos[1] * yFactor + yOffset}
                r={4 / strokeScale}
                style={{ 
                    ...styles,
                    transformOrigin: `${stop.pos[0] * xFactor + xOffset}px ${ - stop.pos[1] * yFactor + yOffset}px`
                }}/>
            ))}
        {activeVeloroute.route.map((s,i) => s.map((stop,idx) => (
            <animated.circle
                key={idx*(i+1)}
                strokeWidth={1 / strokeScale}
                className={activeVelorouteStop && activeVelorouteStop.stop_id===stop.stop_id ? 'veloroute-stop hover' : 'veloroute-stop'}
                cx={stop.pos[0] * xFactor + xOffset}
                cy={ - stop.pos[1] * yFactor + yOffset}
                r={1.3 / strokeScale}
                onMouseEnter={e => hoverVeloStop(e, stop)}
                onMouseLeave={hoverVeloStop}
                style={{ 
                    transformOrigin: `${stop.pos[0] * xFactor + xOffset}px ${ - stop.pos[1] * yFactor + yOffset}px`
                }}/>)
            ))}
        { activeVelorouteStop && (<>
            <text className="destinationLabel veloroute"
                x={(activeVelorouteStop.pos[0] * xFactor + xOffset) + 6 / strokeScale } 
                y={(- activeVelorouteStop.pos[1] * yFactor + yOffset) + 2 / strokeScale }
                style={{ fontSize: `${7 * 1 / strokeScale}px` }}>
                <tspan>{activeVelorouteStop.stop_name}</tspan>
            </text>
        </>)}
        { activeVelorouteSection && (<>
            <AlternativeRoutes />
            <ActiveVelorouteSectionDetails 
                strokeScale={strokeScale}
                section={activeVelorouteSection}/>
        </>)}
    </g>)
}