import './veloroutestop.scss';
import { useSelector, useDispatch } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { svg_scale } from '../../../../data/svg_scale';
import {
    setActiveVelorouteStop,
    selectActiveVelorouteStop
} from '../VeloroutesSlice';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;

export const VelorouteStop = ({
    activeSpot, 
    item, 
    strokeScale, 
    type
}) => {

    const dispatch = useDispatch();
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);

    const outlineStyles = useSpring({ 
        opacity: type==='active' ? 1 : 0,
        scale: type==='active' ? 1 : 0
    });

    const hoverVeloStop = ({type}, id) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(id)) : dispatch(setActiveVelorouteStop(null))
    }

    return (<g>
        { (activeSpot===item.stop_id || activeVelorouteStop?.stop_id===item.stop_id) && (
                <text className="veloroute destinationLabel"
                    x={item.x * xFactor + xOffset + 5/strokeScale}
                    y={ - item.y * yFactor + yOffset}
                    style={{ fontSize: `${7 / strokeScale}px` }}>
                    <tspan>{item.stop_name}</tspan>
                </text>)}
        <animated.circle
            className='veloroute-stop-outline'
            strokeWidth={0.8 / strokeScale}
            cx={item.x * xFactor + xOffset}
            cy={ - item.y * yFactor + yOffset}
            r={4 / strokeScale}
            style={{ 
                ...outlineStyles,
                transformOrigin: `${item.x * xFactor + xOffset}px ${ - item.y * yFactor + yOffset}px`
            }}/>
        <circle
            className={type==='active' ? 'veloroute-stop active' : 'veloroute-stop'}
            cx={item.x * xFactor + xOffset}
            cy={ - item.y * yFactor + yOffset}
            r={type==='active' || activeVelorouteStop?.stop_id===item.stop_id ? 2 / strokeScale : 1.2 / strokeScale}
            onMouseEnter={e => hoverVeloStop(e, item.stop_id)}
            onMouseLeave={hoverVeloStop}
            style={{ 
                transformOrigin: `${item.x * xFactor + xOffset}px ${ - item.y * yFactor + yOffset}px`
            }}/>
    </g>)
}