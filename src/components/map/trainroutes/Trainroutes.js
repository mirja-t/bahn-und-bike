
import './trainroutes.scss';
import { useEffect } from 'react';
import { useTransition } from 'react-spring';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { 
    selectCurrentTrainroutes, 
    setActiveSection,
    selectActiveSection,
    setTrainLinesAlongVeloroute,
    selectTrainlinesAlongVeloroute
} from './TrainroutesSlice';
import { 
    selectActiveVeloroute,
    setActiveVeloroute,
    setActiveVelorouteSection,
    loadVeloroutes
} from '../veloroutes/VeloroutesSlice';
import {
    selectActiveDestination,
    setActiveDestination
} from '../../destinationDetails/DestinationDetailsSlice';
import { Trainroute } from './trainroute/Trainroute';
import { Veloroutes } from '../veloroutes/Veloroutes';
import { useJourney } from '../../../hooks/useJourney';


export const Trainroutes = ({
        zoom
    }) => {

    const dispatch = useDispatch();
    const journeys = useSelector(selectCurrentTrainroutes);
    const activeSection = useSelector(selectActiveSection);
    const activeDestination = useSelector(selectActiveDestination);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const trainlinesAlongVeloroute = useSelector(selectTrainlinesAlongVeloroute);

    const strokeScale = (zoom.containerHeight / 1080) / 2;

    const journey = useJourney(journeys);
    const additionalTrainLines = useJourney(trainlinesAlongVeloroute);

    useEffect(() => {
        const activeIds = activeSection?.stopIds || [activeDestination?.stop_id]
        dispatch(loadVeloroutes(activeIds))
    },[dispatch, activeSection, activeDestination]);

    const setSectionActive = (line) => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveDestination(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
    }

    const setAdditionalTrainlineActive = (line) => {
        dispatch(setActiveSection(line));
    }
    
    const pathTransitions = useTransition(
        journey,
        {
          from: p => ({
              strokeDashoffset: p.pathLength,
              strokeDasharray: p.pathLength
          }),
          leave: p => ({
            strokeDashoffset: p.pathLength,
            strokeDasharray: p.pathLength
            }),
          enter: {
              strokeDashoffset: 0
          },
          delay: 500
        }
      )
    
    return (
        <svg 
            id="routes" 
            x="0px" 
            y="0px" 
            viewBox="0 0 1920 1080" 
            xmlSpace="preserve">
                                       
            { pathTransitions((styles, item) => (
                <Trainroute 
                    key={uuidv4()}
                    classes={activeSection===item ? 'active' : 'inactive'}
                    item={item}
                    fn={setSectionActive}
                    strokeScale={strokeScale}
                    styles={styles}/>
            ))}

            { additionalTrainLines.map(item => (
                <Trainroute 
                    key={uuidv4()}
                    item={item}
                    fn={setAdditionalTrainlineActive}
                    strokeScale={strokeScale} />
            ))}
                
            { activeSection && 
                <Trainroute 
                    classes='active'
                    item={activeSection}
                    strokeScale={strokeScale}/> }
                
            { activeVeloroute && <Veloroutes strokeScale={strokeScale} /> }   
        </svg>)
    }