import './veloroutestop.scss';
import { useSelector, useDispatch } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import {
    setActiveVelorouteStop,
    selectActiveVelorouteStop
} from '../VeloroutesSlice';

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
                    x={item.x + 5/strokeScale}
                    y={item.y}
                    style={{ fontSize: `${7 / strokeScale}px` }}>
                    <tspan>{item.stop_name}</tspan>
                </text>)}
        <animated.circle
            className='veloroute-stop-outline'
            strokeWidth={0.8 / strokeScale}
            cx={item.x}
            cy={item.y}
            r={4 / strokeScale}
            style={{ 
                ...outlineStyles,
                transformOrigin: `${item.x}px ${item.y}px`
            }}/>
        <circle
            className={type==='active' ? 'veloroute-stop active' : 'veloroute-stop'}
            cx={item.x}
            cy={item.y}
            r={type==='active' || activeVelorouteStop?.stop_id===item.stop_id ? 2 / strokeScale : 1.2 / strokeScale}
            onMouseEnter={e => hoverVeloStop(e, item.stop_id)}
            onMouseLeave={hoverVeloStop}
            style={{ 
                transformOrigin: `${item.x}px ${item.y}px`
            }}/>
    </g>)
}