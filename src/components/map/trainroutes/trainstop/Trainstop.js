import './trainstop.scss';
import { useDispatch } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { 
    setActiveSpot
} from '../TrainroutesSlice';

export const Trainstop = ({
    item,
    strokeScale,
    styles
}) => {

    const dispatch = useDispatch();
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

    return (<g className="destination">
        <g 
            className="spotgroup"
            onMouseEnter={(e) => {hoverSpot(e, item)}}
            onMouseLeave={hoverSpot}>

            <circle
                
                className="spot-bg"
                r={6 / strokeScale}
                cx={item.x}
                cy={item.y} />
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
            
        </g>
    </g>)
}