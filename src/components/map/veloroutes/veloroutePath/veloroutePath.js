import { useSelector, useDispatch } from 'react-redux';
import {
    selectHoveredVelorouteSection,
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    setVelorouteSectionActiveThunk
} from '../VeloroutesSlice';
import {
    selectTrainrouteList
} from '../../trainroutes/TrainroutesSlice';

export const VeloroutePath = ({
    idx,
    strokeScale,
    path,
    active
}) => {

    const dispatch = useDispatch();
    const hoveredVrouteSection = useSelector(selectHoveredVelorouteSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const trainrouteList = useSelector(selectTrainrouteList);

    const setVelorouteSectionActive = idx => {
        dispatch(setVelorouteSectionActiveThunk({trainrouteList, activeVeloroute, idx}))
    }

    return (<g
        className={idx===hoveredVrouteSection ? 'hover' : ''}
        onClick={() => {setVelorouteSectionActive(idx)}}>
        <path 
            className={activeVelorouteSection===activeVeloroute.route[idx] || active ? 'veloroute-section active' : 'veloroute-section'}
            strokeWidth={activeVelorouteSection===activeVeloroute.route[idx] || active ? 2 / strokeScale : 1 / strokeScale}
            d={path} />
        <path 
            className="veloroute-section-large"
            strokeWidth={12 / strokeScale}
            d={path} />
    </g>)
}