import { useSelector } from 'react-redux';
import {
    selectActiveSection
} from '../TrainroutesSlice';

export const TrainrouteSection = ({strokeScale}) => {

    const activeSection = useSelector(selectActiveSection);

    return (<g>
        <g 
            className="routegroup active"
            >
            <polyline 
                className="route"
                strokeWidth={1.5 / strokeScale}
                points={activeSection.route} />
            <polyline 
                className="route-bg"
                strokeWidth={9 / strokeScale}
                points={activeSection.route} />
        </g>
    </g>)
}