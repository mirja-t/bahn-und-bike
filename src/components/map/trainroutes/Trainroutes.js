
import './trainroutes.scss';
import { useEffect } from 'react';
import { animated, useTransition } from 'react-spring';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectCurrentTrainroutes, 
    selectActiveSpot, 
    setActiveSpot,
    setActiveSection,
    selectActiveSection,
    setTrainLinesAlongVeloroute,
    selectTrainlinesAlongVeloroute
} from './TrainroutesSlice';
import { 
    selectActiveVeloroute,
    setActiveVeloroute,
    setActiveVelorouteSection,
    selectActiveVelorouteSection,
    loadVeloroutes
} from '../veloroutes/VeloroutesSlice';
import {
    selectDestinationList,
    selectActiveDestination,
    setActiveDestination
} from '../../destinationDetails/DestinationDetailsSlice';
import { ActiveDestination } from './activeDestination/ActiveDestination';
import { Veloroutes } from '../veloroutes/Veloroutes';
import { TrainrouteSection } from './trainrouteSection/TrainrouteSection';
import { useJourney } from '../../../hooks/useJourney';
import { svg_scale } from '../../../data/svg_scale';
const { xFactor, yFactor, xOffset, yOffset } = svg_scale;


export const Trainroutes = ({
        zoom
    }) => {

    const dispatch = useDispatch();
    const destinations = useSelector(selectDestinationList);
    const journeys = useSelector(selectCurrentTrainroutes);
    const activeSpot = useSelector(selectActiveSpot);
    const activeSection = useSelector(selectActiveSection)
    const activeDestination = useSelector(selectActiveDestination);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const trainlinesAlongVeloroute = useSelector(selectTrainlinesAlongVeloroute);

    const strokeScale = (zoom.containerHeight / 1080) / 2;

    const journey = useJourney(journeys);
    const additionalTrainLines = useJourney(trainlinesAlongVeloroute);

    useEffect(() => {
        const activeIds = activeSection?.stopIds || [activeDestination?.stop_id]
        dispatch(loadVeloroutes(activeIds))
    },[dispatch, activeSection, activeDestination]);

    const setDestinationActive = (dest) => {
        const destination = destinations[dest.stop_id]
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveSection(null))
        dispatch(setActiveDestination(destination))
    }

    const setSectionActive = (line) => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveDestination(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
    }

    const hoverSpot = ({type}, spot) => {
        if(type === 'mouseenter') dispatch(setActiveSpot(spot))
        else if(type === 'mouseleave') dispatch(setActiveSpot(null))
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

      const spotTransitions = useTransition(
        journey,
        {
          from: { scale: 0 },
          leave: { scale: 0 },
          enter: { scale: 1 },
          delay: 1500
        }
      )
    
    return (
        <svg 
            id="routes" 
            x="0px" 
            y="0px" 
            viewBox="0 0 1920 1080" 
            xmlSpace="preserve">
                                       
            { pathTransitions((styles, item, t, i) => (
                <g 
                    key={i}
                    className={activeSection || activeDestination ? `routegroup ${activeSection===item ? 'active' : 'inactive'}` : 'routegroup'}
                    onClick={() => setSectionActive(item)}
                    >
                    <animated.polyline 
                        className="route-bg"
                        strokeWidth={5 / strokeScale}
                        points={item.route}
                        style={styles} />
                    <animated.polyline 
                        className="route"
                        strokeWidth={1 / strokeScale}
                        points={item.route}
                        style={styles} />
                </g>))}

            { additionalTrainLines.map((item, i) => (
                <g 
                    key={i}
                    className={activeSection || activeDestination ? `routegroup ${activeSection===item ? 'active' : ''}` : 'routegroup'}
                    >
                    <animated.polyline 
                        className="route"
                        strokeWidth={activeSection || activeDestination ? 1.5 / strokeScale : 1 / strokeScale}
                        points={item.route} />
                    <animated.polyline 
                        className="route-bg"
                        strokeWidth={9 / strokeScale}
                        points={item.route}
                        onClick={() => setSectionActive(item)} />
            </g>))}

                { activeSection && <TrainrouteSection strokeScale={strokeScale} /> }
                { activeVeloroute && <Veloroutes strokeScale={strokeScale} /> }

                { activeVelorouteSection && 
                [activeVelorouteSection[0], activeVelorouteSection[activeVelorouteSection.length-1]]
                .map((item, idx) => (
                    <g 
                        key={idx}
                        className={`destination ${activeDestination?.stop_id===item.stop_id ? 'active' : ''}`}>
                        <g 
                            onMouseEnter={(e) => {hoverSpot(e, item.stop_id)}}
                            onMouseLeave={hoverSpot}
                            onClick={e => setDestinationActive(item)}
                            className={`spotgroup veloroutestop ${activeSpot===item.stop_id ? 'hover' : ''} ${activeDestination?.stop_id === item.stop_id ? 'active' : ''}`}
                            >
                            <animated.rect
                                className="spot spot-large"
                                x={(item.pos[0] * xFactor + xOffset) - (2 / strokeScale )} 
                                y={ - item.pos[1] * yFactor + yOffset - (2 / strokeScale )}
                                width={4 / strokeScale}
                                height={4 / strokeScale}
                                style={{ 
                                    transformOrigin: `${item.pos[0] * xFactor + xOffset }px ${ - item.pos[1] * yFactor + yOffset}px`
                                }}/>
                            <animated.rect
                                className="spot spot-small"
                                x={(item.pos[0] * xFactor + xOffset) -  (2 / strokeScale )} 
                                y={ - item.pos[1] * yFactor + yOffset -  (2 / strokeScale )}
                                width={4 / strokeScale}
                                height={4 / strokeScale}
                                style={{ 
                                    transformOrigin: `${item.pos[0] * xFactor + xOffset }px ${ - item.pos[1] * yFactor + yOffset}px`
                                }}/>
                            
                            <circle
                                className="spot-bg"
                                r={6 / strokeScale}
                                cx={item.pos[0] * xFactor + xOffset } 
                                cy={ - item.pos[1] * yFactor + yOffset} />
                        </g>
                            </g>))}  

            {spotTransitions((styles, item, t, i) => (
                <g 
                    className={`destination ${activeDestination?.stop_id===item.lastStation.stop_id ? 'active' : ''}`}
                    key={i}>
                    { activeSpot===item.lastStation.stop_id && (<>
                            <text className="destinationLabel"
                                x={item.lastStation.x + 6 / strokeScale } 
                                y={item.lastStation.y + 2 / strokeScale }
                                style={{ fontSize: `${7 / strokeScale}px` }}>
                                <tspan>{item.lastStation.stop_name}</tspan>
                            </text>
                        </>)}
                    <g 
                        onClick={e => setDestinationActive(item.lastStation)}
                        onMouseEnter={(e) => {hoverSpot(e, item.lastStation.stop_id)}}
                        onMouseLeave={hoverSpot}
                        className={'spotgroup' + 
                            `${activeSpot===item.lastStation.stop_id ? ' hover' : ''}` +
                            `${activeDestination?.stop_id && activeDestination?.stop_id===item.lastStation.stop_id ? ' active' : ''}` +
                            `${(activeSection && activeSpot!==item.lastStation.stop_id) || (activeDestination?.stop_id && activeDestination?.stop_id !== item.lastStation.stop_id) ? ' inactive' : ''}` +
                            `${((activeSection && activeSection.lastStation.stop_id === item.lastStation.stop_id)) ? ' sectionstop' : ''}` +
                            `${(activeVelorouteSection && [activeVelorouteSection[0].stop_id, activeVelorouteSection[activeVelorouteSection.length-1].stop_id].includes(item.lastStation.stop_id)) ? ' velosectionstop' : ''}`
                        }>
                        <ActiveDestination 
                            activeDestination={activeDestination?.stop_id}
                            item={item}
                            strokeScale={strokeScale}/>
                        <animated.rect
                            className="spot spot-large"
                            x={ item.lastStation.x - 1.5 / strokeScale}
                            y={ item.lastStation.y - 1.5 / strokeScale}
                            width={3 / strokeScale}
                            height={3 / strokeScale}
                            style={{ 
                                scale: styles.scale,
                                transformOrigin: `${item.lastStation.x}px ${item.lastStation.y}px`
                            }}/>
                        <animated.rect
                            className="spot spot-small"
                            x={ item.lastStation.x - 1.5 / strokeScale}
                            y={ item.lastStation.y - 1.5 / strokeScale}
                            width={3 / strokeScale}
                            height={3 / strokeScale}
                            style={{ 
                                scale: styles.scale,
                                transformOrigin: `${item.lastStation.x}px ${item.lastStation.y}px`
                            }}/>
                        <circle
                            className="spot-bg"
                            r={6 / strokeScale}
                            cx={item.lastStation.x}
                            cy={item.lastStation.y} />
                    </g>
                </g>))}   
        </svg>)
    }