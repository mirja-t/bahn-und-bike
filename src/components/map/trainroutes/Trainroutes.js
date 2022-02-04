
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
    selectActiveDestinationId,
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
    const journeys = useSelector(selectCurrentTrainroutes);
    const activeSpot = useSelector(selectActiveSpot);
    const activeSection = useSelector(selectActiveSection)
    const activeDestination = useSelector(selectActiveDestinationId);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const trainlinesAlongVeloroute = useSelector(selectTrainlinesAlongVeloroute);

    const journey = useJourney(journeys);
    const additionalTrainLines = useJourney(trainlinesAlongVeloroute);

    useEffect(() => {
        const activeIds = activeSection?.stopIds || [activeDestination]
        dispatch(loadVeloroutes(activeIds))
    },[dispatch, activeSection, activeDestination]);

    const setDestinationActive = (id) => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveSection(null))
        dispatch(setActiveDestination(id))
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
                        strokeWidth={12 / zoom.scale}
                        points={item.route}
                        style={styles} />
                    <animated.polyline 
                        className="route"
                        strokeWidth={3 / zoom.scale}
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
                        strokeWidth={activeSection || activeDestination ? 5 / zoom.scale : 3 / zoom.scale}
                        points={item.route} />
                    <animated.polyline 
                        className="route-bg"
                        strokeWidth={9 / zoom.scale}
                        points={item.route}
                        onClick={() => setSectionActive(item)} />
            </g>))}

                { activeSection && <TrainrouteSection zoom={zoom} /> }
                { activeVeloroute && <Veloroutes zoom={zoom} /> }

                { activeVelorouteSection && 
                [activeVelorouteSection[0], activeVelorouteSection[activeVelorouteSection.length-1]]
                .map((item, idx) => (
                    <g 
                        key={idx}
                        className={`destination ${activeDestination===item.stop_id ? 'active' : ''}`}>
                        <g 
                            onMouseEnter={(e) => {hoverSpot(e, item.stop_id)}}
                            onMouseLeave={hoverSpot}
                            onClick={e => setDestinationActive(item.stop_id)}
                            className={`spotgroup veloroutestop ${activeSpot===item.stop_id ? 'hover' : ''} ${activeDestination === item.stop_id ? 'active' : ''}`}
                            >
                            <animated.rect
                                className="spot spot-large"
                                x={(item.pos[0] * xFactor + xOffset) - (5 / zoom.scale )} 
                                y={ - item.pos[1] * yFactor + yOffset - (5 / zoom.scale )}
                                width={10 / zoom.scale}
                                height={10 / zoom.scale}
                                style={{ 
                                    transformOrigin: `${item.pos[0] * xFactor + xOffset }px ${ - item.pos[1] * yFactor + yOffset}px`
                                }}/>
                            <animated.rect
                                className="spot spot-small"
                                x={(item.pos[0] * xFactor + xOffset) -  (5 / zoom.scale )} 
                                y={ - item.pos[1] * yFactor + yOffset -  (5 / zoom.scale )}
                                width={10 / zoom.scale}
                                height={10 / zoom.scale}
                                style={{ 
                                    transformOrigin: `${item.pos[0] * xFactor + xOffset }px ${ - item.pos[1] * yFactor + yOffset}px`
                                }}/>
                            
                            <circle
                                className="spot-bg"
                                r={12 / zoom.scale}
                                cx={item.pos[0] * xFactor + xOffset } 
                                cy={ - item.pos[1] * yFactor + yOffset} />
                        </g>
                            </g>))}  

            {spotTransitions((styles, item, t, i) => (
                <g 
                    className={`destination ${activeDestination===item.lastStation.stop_id ? 'active' : ''}`}
                    key={i}>
                    { activeSpot===item.lastStation.stop_id && (<>
                            <text className="destinationLabel"
                                x={item.lastStation.x + 20 / zoom.scale } 
                                y={item.lastStation.y + 8 / zoom.scale }
                                style={{ fontSize: `${21 * 1 / zoom.scale}px` }}>
                                <tspan>{item.lastStation.stop_name}</tspan>
                            </text>
                        </>)}
                    <g 
                        onClick={e => setDestinationActive(item.lastStation.stop_id)}
                        onMouseEnter={(e) => {hoverSpot(e, item.lastStation.stop_id)}}
                        onMouseLeave={hoverSpot}
                        className={'spotgroup' + 
                            `${activeSpot===item.lastStation.stop_id ? ' hover' : ''}` +
                            `${activeDestination && activeDestination===item.lastStation.stop_id ? ' active' : ''}` +
                            `${(activeSection && activeSpot!==item.lastStation.stop_id) || (activeDestination && activeDestination !== item.lastStation.stop_id) ? ' inactive' : ''}` +
                            `${((activeSection && activeSection.lastStation.stop_id === item.lastStation.stop_id)) ? ' sectionstop' : ''}` +
                            `${(activeVelorouteSection && [activeVelorouteSection[0].stop_id, activeVelorouteSection[activeVelorouteSection.length-1].stop_id].includes(item.lastStation.stop_id)) ? ' velosectionstop' : ''}`
                        }>
                        <ActiveDestination 
                            activeDestination={activeDestination}
                            item={item}
                            zoom={zoom}/>
                        <animated.rect
                            className="spot spot-large"
                            x={ item.lastStation.x - 5 / zoom.scale}
                            y={ item.lastStation.y - 5 / zoom.scale}
                            width={10 / zoom.scale}
                            height={10 / zoom.scale}
                            style={{ 
                                scale: styles.scale,
                                transformOrigin: `${item.lastStation.x}px ${item.lastStation.y}px`
                            }}/>
                        <animated.rect
                            className="spot spot-small"
                            x={ item.lastStation.x - 5 / zoom.scale}
                            y={ item.lastStation.y - 5 / zoom.scale}
                            width={10 / zoom.scale}
                            height={10 / zoom.scale}
                            style={{ 
                                scale: styles.scale,
                                transformOrigin: `${item.lastStation.x}px ${item.lastStation.y}px`
                            }}/>
                        <circle
                            className="spot-bg"
                            r={12 / zoom.scale}
                            cx={item.lastStation.x}
                            cy={item.lastStation.y} />
                    </g>
                </g>))}   
        </svg>)
    }