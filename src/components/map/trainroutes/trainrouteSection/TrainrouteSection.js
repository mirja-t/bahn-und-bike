import { useSelector } from 'react-redux';
import {
    selectActiveSection
} from '../TrainroutesSlice';

export const TrainrouteSection = ({zoom}) => {

    const activeSection = useSelector(selectActiveSection);

    return (<g>
        <g 
            className="routegroup active"
            >
            <polyline 
                className="route"
                strokeWidth={5 / zoom.scale}
                points={activeSection.route} />
            <polyline 
                className="route-bg"
                strokeWidth={9 / zoom.scale}
                points={activeSection.route} />
        </g>
    </g>)
}