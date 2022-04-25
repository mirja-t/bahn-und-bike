
import './trainroutes.scss';
import { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectCurrentTrainroutes, 
    selectActiveSection,
    selectTrainlinesAlongVeloroute,
    selectActiveSpot
} from './TrainroutesSlice';
import { 
    selectActiveVeloroute,
    loadVeloroutes,
    selectActiveVelorouteStop
} from '../veloroutes/VeloroutesSlice';
import { Trainroute } from './trainroute/Trainroute';
import { Veloroutes } from '../veloroutes/Veloroutes';
import { Label } from '../label/Label';

export const Trainroutes = memo(function Trainroutes({ containerHeight }) {

    const dispatch = useDispatch();
    const journeys = useSelector(selectCurrentTrainroutes);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSpot = useSelector(selectActiveSpot);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const trainlinesAlongVeloroute = useSelector(selectTrainlinesAlongVeloroute);
    const strokeScale = (containerHeight / 1080) / 2;
    
    useEffect(() => {
        if(!activeSection?.stopIds) return
        dispatch(loadVeloroutes(activeSection?.stopIds))
    },[dispatch, activeSection]);

    const getClassName = (item) => {
        if(!activeSection && !trainlinesAlongVeloroute.length){
            return 'init'
        }
        else if(activeSection===item){
            return 'active'
        }
        else {
            return 'inactive'
        }
    }

    return (
        <svg 
            id="routes" 
            x="0px" 
            y="0px" 
            viewBox="0 0 1920 1080" 
            xmlSpace="preserve">
                
            { journeys.map((item, idx) => (
                <Trainroute 
                    key={idx}
                    className={getClassName(item)}
                    item={item}
                    strokeScale={strokeScale}
                    />
            ))}

            { trainlinesAlongVeloroute.map((item, idx) => (
                <Trainroute 
                    key={idx}
                    className="active"
                    item={item}
                    strokeScale={strokeScale} />
            ))}
            
            { activeSection && 
                <Trainroute 
                    className="active"
                    item={activeSection}
                    strokeScale={strokeScale}/> }

            { activeVeloroute && 
                <Veloroutes 
                    strokeScale={strokeScale} /> }   

            { (activeSpot || activeVelorouteStop) && (
                <Label 
                    item={activeSpot || activeVelorouteStop}
                    className={activeSpot ? 'train' : 'veloroute'}
                    strokeScale={strokeScale} />)}
        </svg>)
});