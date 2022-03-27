import { animated } from 'react-spring';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { 
    selectActiveSection
} from '../TrainroutesSlice';
import {
    selectActiveVelorouteSection
} from '../../veloroutes/VeloroutesSlice';
import {
    selectActiveDestination
} from '../../../destinationDetails/DestinationDetailsSlice';
import { Trainstop } from '../trainstop/Trainstop';

export const Trainroute = ({
    classes,
    item, 
    fn,
    strokeScale, 
    styles
}) => {

    const activeSection = useSelector(selectActiveSection)
    const activeDestination = useSelector(selectActiveDestination);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);

    const handleClick = () => {
        fn && fn(item)
    }

    return (<g 
        className={activeSection || activeDestination || activeVelorouteSection ? `routegroup ${classes && classes}` : `routegroup`}
        onClick={handleClick}
        >
        <animated.polyline 
            className="route-bg"
            strokeWidth={5 / strokeScale}
            points={item.points}
            style={styles} />
        <animated.polyline 
            className="route"
            strokeWidth={1 / strokeScale}
            points={item.points}
            style={{...styles}} />
        <Trainstop 
            key={uuidv4()}
            styles={{scale: 1}}
            item={item.lastStation}
            strokeScale={strokeScale} />
    </g>)
}