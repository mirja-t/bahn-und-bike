import './velorouteDetails.scss';

import { useSelector, useDispatch } from 'react-redux';
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { selectLang } from '../../AppSlice';
import { 
    selectActiveVeloroute, 
    selectActiveVelorouteSection,
    setActiveVelorouteStop,
    selectActiveVelorouteStop
} from '../map/veloroutes/VeloroutesSlice';
import { useDistance } from '../../hooks/useDistance';
import { ActiveVelorouteSectionIcon } from './activeVelorouteSectionIcon/ActiveVelorouteSectionIcon';
import { PinIcon } from '../stateless/icons/PinIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';

export const VelorouteDetails = ({
    parent, 
    detailsActive,
    lang
}) => {
    
    const dispatch = useDispatch();

    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const dist = useDistance(activeVelorouteSection);

    const hoverVeloStop = ({type}, id) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(id)) : dispatch(setActiveVelorouteStop(null))
    }
    
    return (<ScrollContent parentEl={parent} transitionComplete={detailsActive}>
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
                    <div className="veloroute-details">
                        <h5>{`${labels.totaldistance[lang]}`}</h5>
                        <p>{activeVeloroute.len}km</p>
                        <h5>{`${labels.tourroute[lang]}`}</h5>
                        <ul className="veloroute-stops">
                            {activeVeloroute.route.map((arr, idx) => arr.map((s, i) =>
                                (<li key={(idx+1)*i+100}>
                                    <span 
                                        className={activeVelorouteStop && activeVelorouteStop.stop_id===s.stop_id ? 'hover' : ''}
                                        onMouseEnter={e => hoverVeloStop(e, s)}
                                        onMouseLeave={hoverVeloStop}>
                                            {((idx===0 && i === 0) || (i > 0)) && s.stop_name}</span>
                                    {(((idx===0 && i === 0) || (i > 0)) && !(activeVeloroute.route.length-1===idx && arr.length-1===i)) && `, `}
                                </li>)
                            ))}
                        </ul>
                    </div>
                    { activeVelorouteSection && (
                        <div className="veloroute-section-details">
                            <h5>{`${labels.leg[lang]}`}</h5>
                            <h3 className="veloroute-trainstops">
                                <ActiveVelorouteSectionIcon num={1}/>
                                {`${labels.from[lang]} ${activeVelorouteSection[0].stop_name}`} 
                                { activeVelorouteSection[0].train_list.map((s, i) => (
                                    <span 
                                        key ={i} 
                                        className="train">{s}</span>
                                ))}
                            </h3>
                            <h3 className="veloroute-trainstops">
                                <ActiveVelorouteSectionIcon num={2}/>
                                {`${labels.to[lang]} ${activeVelorouteSection[activeVelorouteSection.length - 1].stop_name}`}
                                { activeVelorouteSection[activeVelorouteSection.length - 1].train_list.map((s, i) => (
                                    <span 
                                        key={i}
                                        className="train">{s}</span>))}
                            </h3>
                            { activeVelorouteSection.length > 2 && (<>
                                <h6>{`${labels.via[lang]}`}</h6>
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
                        </div>)}
                </div>
            )}
        </div>
    </ScrollContent>)
}