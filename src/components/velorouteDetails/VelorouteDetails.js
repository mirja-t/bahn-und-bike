import './velorouteDetails.scss';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { selectLang } from '../../AppSlice';
import { 
    selectActiveVeloroute, 
    selectActiveVelorouteSection,
    setActiveVelorouteStop,
    selectActiveVelorouteStop,
    selectCombinedVeloroute,
    setActiveVelorouteSection,
    loadCrossingVeloroutes,
    setCombinedVeloroute,
    setHoveredVelorouteSection
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectTrainrouteList,
    setTrainLinesAlongVeloroute,
    setActiveSection
} from '../map/trainroutes/TrainroutesSlice';
import { generateTrainlinesAlongVeloroute } from '../../utils/generateTrainlinesAlongVeloroute';
import { useDistance } from '../../hooks/useDistance';
import { ActiveVelorouteSectionIcon } from './activeVelorouteSectionIcon/ActiveVelorouteSectionIcon';
import { PinIcon } from '../stateless/icons/PinIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';
import { Collapse } from '../stateless/collapse/Collapse';

export const VelorouteDetails = ({
    parent, 
    lang
}) => {

    const dispatch = useDispatch();

    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const combinedVeloroute = useSelector(selectCombinedVeloroute);
    const trainrouteList = useSelector(selectTrainrouteList);
    const dist = useDistance(activeVelorouteSection);

    const hoverVeloStop = ({type}, id) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(id)) : dispatch(setActiveVelorouteStop(null))
    }

    const setVelorouteSectionActive = idx => {
        const activeVRoute = activeVeloroute.route[idx];
        const routeIds = activeVRoute.map(stop => stop.stop_id);
        dispatch(setActiveVelorouteSection(activeVRoute))  
        const stopIds = [activeVRoute[0].stop_id, activeVRoute[activeVRoute.length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
        dispatch(loadCrossingVeloroutes(routeIds))
        dispatch(setCombinedVeloroute(null));
        dispatch(setActiveSection(null));
    }

    const hoverVelorouteSection = ({type}, idx) => {
        type==='mouseenter' ? dispatch(setHoveredVelorouteSection(idx)) : dispatch(setHoveredVelorouteSection(null))  
    }

    return (<ScrollContent parentEl={parent} transitionComplete={true}>
            <div 
                id="veloroute"
                className="details"
            >
            {activeVeloroute && (
                <div>
                    <header>
                        <div className="details-headline">
                            <PinIcon><VelorouteIcon/></PinIcon>
                            <h2>{`${activeVeloroute.name}`}</h2>
                        </div>
                    </header>
                    <section className="veloroute-details">
                        <h5>{`${labels.totaldistance[lang]}`}</h5>
                        <p>{activeVeloroute.len}km</p>
                        <Collapse title='Streckenabschnitte'>
                            <ol className="veloroute-stops">
                                {activeVeloroute.route
                                .slice(0, activeVeloroute.route[0][0].stop_id === activeVeloroute.route[activeVeloroute.route.length-1][activeVeloroute.route[activeVeloroute.route.length-1].length-1].stop_id ? activeVeloroute.route.length-1 : activeVeloroute.route.length)
                                .map((arr, idx) =>
                                    (<li 
                                        key={uuidv4()}
                                        onClick={() => setVelorouteSectionActive(idx)}
                                        onMouseEnter={e => hoverVelorouteSection(e, idx)}
                                        onMouseLeave={e => hoverVelorouteSection(e)}>
                                        <div>{`${arr[0].stop_name} to ${arr[arr.length-1].stop_name}`}</div>
                                    </li>))}
                            </ol>
                        </Collapse>
                    </section>
                    { activeVelorouteSection ? (
                        <section className="veloroute-details veloroute-section-details">
                            <h5>{`${labels.leg[lang]}`}</h5>
                            <h3 className="veloroute-trainstops">
                                <ActiveVelorouteSectionIcon num={1}/>
                                <span>
                                    {`${labels.from[lang]} ${activeVelorouteSection[0].stop_name}`} 
                                    { activeVelorouteSection[0].train_list.map((s, i) => (
                                        <span 
                                            key ={i} 
                                            className="train">{s}</span>
                                    ))}
                                </span>
                            </h3>
                            <h3 className="veloroute-trainstops">
                                <ActiveVelorouteSectionIcon num={2}/>
                                <span>
                                    {`${labels.to[lang]} ${activeVelorouteSection[activeVelorouteSection.length - 1].stop_name}`}
                                    { activeVelorouteSection[activeVelorouteSection.length - 1].train_list.map((s, i) => (
                                        <span 
                                            key={i}
                                            className="train">{s}</span>))}
                                </span>
                            </h3>
                            { combinedVeloroute && (<>
                                    <h6>{labels.combined_veloroute[lang]}</h6>
                                    <p>{combinedVeloroute}</p>
                                </>)}
                            { activeVelorouteSection.length > 2 && (<>
                                <h6>{labels.via[lang]}</h6>
                                <ul className="veloroute-stops">
                                    {activeVelorouteSection.slice(1,activeVelorouteSection.length-1).map((s, idx) => 
                                        (<li key={idx}>
                                            <span 
                                                className={activeVelorouteStop && activeVelorouteStop.stop_id===s.stop_id ? 'hover' : ''}
                                                onMouseEnter={e => hoverVeloStop(e, s)}
                                                onMouseLeave={hoverVeloStop}>
                                                    {s.stop_name}</span>
                                            { idx !== activeVelorouteSection.slice(1,activeVelorouteSection.length-1).length-1 && `, `}
                                        </li>))}
                                </ul>
                            </>)}
                            <h6>{`${labels.distance[lang]} (${labels.airline[lang]})`}</h6>
                            <p>{dist} km</p>
                            
                        </section>) : labels.nolegchosen[lang]}
                </div>
            )}
        </div>
    </ScrollContent>)
}