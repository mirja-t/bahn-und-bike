import './veloroutes.scss';
import { animated, useTransition } from 'react-spring';
import { 
    useDispatch,
    useSelector 
} from 'react-redux';
import { 
    setActiveVelorouteSection,
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    setActiveVelorouteStop,
    selectActiveVelorouteStop
} from './VeloroutesSlice';
import {
    selectTrainrouteList,
    setTrainLinesAlongVeloroute
} from '../trainroutes/TrainroutesSlice';
import { useRoutePath } from '../../../hooks/useRoutePath';
import { ActiveVelorouteSectionDetails } from './activeVelorouteSectionDetails/ActiveVelorouteSectionDetails';
import { generateTrainlinesAlongVeloroute } from '../../../utils/generateTrainlinesAlongVeloroute';

import { svg_scale } from '../../../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const Veloroutes = ({zoom}) => {

    const dispatch = useDispatch();
    const trainrouteList = useSelector(selectTrainrouteList);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const routePaths = useRoutePath(activeVeloroute.route);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const setVelorouteSectionActive = idx => {
        const activeVRoute = activeVeloroute.route[idx];
        dispatch(setActiveVelorouteSection(activeVRoute))        
        const stops = [activeVRoute[0].stop_id, activeVRoute[activeVRoute.length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stops);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
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
                strokeWidth={activeVelorouteSection===activeVeloroute.route[idx] ? 5 / zoom.scale : 3 / zoom.scale}
                className={activeVelorouteSection===activeVeloroute.route[idx] ? 'veloroute-section active' : 'veloroute-section'}
                d={path} />
            <path 
                strokeWidth={12 / zoom.scale}
                className="veloroute-section-large"
                d={path} />
            </g>
        
        ))}
        { spotTransitions((styles, stop, t, idx) => (
            <animated.circle
                key={idx}
                strokeWidth={3 / zoom.scale}
                className="veloroute-station"
                cx={stop.pos[0] * xFactor + xOffset}
                cy={ - stop.pos[1] * yFactor + yOffset}
                r={14 / zoom.scale}
                style={{ 
                    ...styles,
                    transformOrigin: `${stop.pos[0] * xFactor + xOffset}px ${ - stop.pos[1] * yFactor + yOffset}px`
                }}/>
            ))}
        {activeVeloroute.route.map((s,i) => s.map((stop,idx) => (
            <animated.circle
                key={idx*(i+1)}
                strokeWidth={3 / zoom.scale}
                className={activeVelorouteStop && activeVelorouteStop.stop_id===stop.stop_id ? 'veloroute-stop hover' : 'veloroute-stop'}
                cx={stop.pos[0] * xFactor + xOffset}
                cy={ - stop.pos[1] * yFactor + yOffset}
                r={4 / zoom.scale}
                onMouseEnter={e => hoverVeloStop(e, stop)}
                onMouseLeave={hoverVeloStop}
                style={{ 
                    transformOrigin: `${stop.pos[0] * xFactor + xOffset}px ${ - stop.pos[1] * yFactor + yOffset}px`
                }}/>)
            ))}
        { activeVelorouteStop && (<>
            <text className="destinationLabel veloroute"
                x={(activeVelorouteStop.pos[0] * xFactor + xOffset) + 20 / zoom.scale } 
                y={(- activeVelorouteStop.pos[1] * yFactor + yOffset) + 8 / zoom.scale }
                style={{ fontSize: `${21 * 1 / zoom.scale}px` }}>
                <tspan>{activeVelorouteStop.stop_name}</tspan>
            </text>
        </>)}
        { activeVelorouteSection && <ActiveVelorouteSectionDetails 
            zoom={zoom}
            section={activeVelorouteSection}
        />}
    </g>)
}