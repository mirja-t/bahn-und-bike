import './trainstop.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { ActiveDestination } from '../activeDestination/ActiveDestination';
import { 
    selectActiveSpot, 
    setActiveSpot
} from '../TrainroutesSlice';
import {
    selectActiveDestination
} from '../../../destinationDetails/DestinationDetailsSlice';

export const Trainstop = ({
    item,
    strokeScale,
    styles
}) => {

    const dispatch = useDispatch();
    const activeDestination = useSelector(selectActiveDestination);
    const activeSpot = useSelector(selectActiveSpot);

    const hoverSpot = ({type}, spot) => {
        if(type === 'mouseenter') dispatch(setActiveSpot(spot))
        else if(type === 'mouseleave') dispatch(setActiveSpot(null))
    }

    const spotTransition = useTransition(item,{
        from: { scale: 0 },
        enter: { scale: 1 },
        leave: { scale: 0 },
        config: {
            tension: 210,
            friction: 20
          },
        delay: 1500
    });

    return (<g 
        className={`destination ${activeSpot===item.stop_id ? 'hover' : ''}`}
        >
        { activeSpot===item.stop_id && (<>
                <text className="destinationLabel"
                    x={item.x + 6 / strokeScale } 
                    y={item.y + 2 / strokeScale }
                    style={{ fontSize: `${7 / strokeScale}px` }}>
                    <tspan>{item.stop_name}</tspan>
                </text>
        </>)}
        <g 
            onMouseEnter={(e) => {hoverSpot(e, item.stop_id)}}
            onMouseLeave={hoverSpot}
            
            className="spotgroup">
            {activeDestination && <ActiveDestination 
                activeDestination={activeDestination.stop_id}
                item={item}
                strokeScale={strokeScale}/>}

            <animated.rect
                className="spot spot-large"
                x={ item.x - 1.5 / strokeScale}
                y={ item.y - 1.5 / strokeScale}
                width={3 / strokeScale}
                height={3 / strokeScale}
                style={{ 
                    scale: styles.scale,
                    transformOrigin: `${item.x}px ${item.y}px`
                }}/>
            {spotTransition((styles, item) => (<animated.rect
                className="spot spot-small"
                x={ item.x - 1.5 / strokeScale}
                y={ item.y - 1.5 / strokeScale}
                width={3 / strokeScale}
                height={3 / strokeScale}
                style={{ 
                    scale: styles.scale,
                    transformOrigin: `${item.x}px ${item.y}px`
                }}/>))}
            <circle
                className="spot-bg"
                r={6 / strokeScale}
                cx={item.x}
                cy={item.y} />
        </g>
    </g>)
}