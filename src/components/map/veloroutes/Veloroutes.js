import './veloroutes.scss';
import { v4 as uuidv4 } from 'uuid';
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
    setCombinedVeloroute,
    selectHoveredVelorouteSection
} from './VeloroutesSlice';
import {
    selectTrainrouteList,
    setTrainLinesAlongVeloroute,
    setActiveSection
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
    const hoveredVrouteSection = useSelector(selectHoveredVelorouteSection);

    const setVelorouteSectionActive = idx => {
        const activeVRoute = activeVeloroute.route[idx];
        const routeIds = activeVRoute.map(stop => stop.stop_id);
        dispatch(setActiveVelorouteSection(activeVRoute))  
        const stopIds = [activeVRoute[0].stop_id, activeVRoute[activeVRoute.length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
        dispatch(loadCrossingVeloroutes(routeIds))
        dispatch(setCombinedVeloroute(null));
        dispatch(setActiveSection(null));
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
                className={idx===hoveredVrouteSection ? 'hover' : ''}
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
        { spotTransitions((styles, stop, _, idx) => (
            <animated.circle
                key={idx}
                strokeWidth={1 / strokeScale}
                className="veloroute-station"
                cx={stop.x * xFactor + xOffset}
                cy={ - stop.y * yFactor + yOffset}
                r={4 / strokeScale}
                style={{ 
                    ...styles,
                    transformOrigin: `${stop.x * xFactor + xOffset}px ${ - stop.y * yFactor + yOffset}px`
                }}/>
            ))}
        {activeVeloroute.route.map(s => 
            (<circle
                key={uuidv4()}
                className='veloroute-stop hover'
                cx={s[0].x * xFactor + xOffset}
                cy={ - s[0].y * yFactor + yOffset}
                r={0.8 / strokeScale}
                style={{ 
                    transformOrigin: `${s[0].x * xFactor + xOffset}px ${ - s[0].y * yFactor + yOffset}px`
                }}
            />)
        )}
        {activeVeloroute.route.map(s => s.map(stop => (
                <circle
                    key={uuidv4()}
                    strokeWidth={1 / strokeScale}
                    className={activeVelorouteStop && activeVelorouteStop.stop_id===stop.stop_id ? 'veloroute-stop hover' : 'veloroute-stop'}
                    cx={stop.x * xFactor + xOffset}
                    cy={ - stop.y * yFactor + yOffset}
                    r={0.8 / strokeScale}
                    onMouseEnter={e => hoverVeloStop(e, stop)}
                    onMouseLeave={hoverVeloStop}
                    style={{ 
                        transformOrigin: `${stop.x * xFactor + xOffset}px ${ - stop.y * yFactor + yOffset}px`
                    }}/>)))}

        { activeVelorouteStop && (<>
            <text className="destinationLabel veloroute"
                x={(activeVelorouteStop.x * xFactor + xOffset) + 6 / strokeScale } 
                y={(- activeVelorouteStop.y * yFactor + yOffset) + 2 / strokeScale }
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