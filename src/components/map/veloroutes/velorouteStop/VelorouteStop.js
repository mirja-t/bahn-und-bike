import './veloroutestop.scss';
import { useSelector, useDispatch } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import {
    setActiveVelorouteStop,
    selectActiveVelorouteStop
} from '../VeloroutesSlice';

export const VelorouteStop = ({
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

    const hoverVeloStop = ({type}, spot) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(spot)) : dispatch(setActiveVelorouteStop(null))
    }

    return (<g>
        
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
            onMouseEnter={e => hoverVeloStop(e, item)}
            onMouseLeave={hoverVeloStop}
            style={{ 
                transformOrigin: `${item.x}px ${item.y}px`
            }}/>
    </g>)
}