import { useSelector, useDispatch } from 'react-redux';
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { PinIcon } from '../stateless/icons/PinIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';
import { ActiveVelorouteSectionIcon } from './activeVelorouteSectionIcon/ActiveVelorouteSectionIcon';
import { selectLang } from '../../AppSlice';
import { 
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    selectCombinedVeloroute,
    setActiveVelorouteStop
} from '../map/veloroutes/VeloroutesSlice';

export const CombinedVelorouteDetails = ({
    parent, 
    lang
}) => {

    const dispatch = useDispatch();
    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection = activeVelorouteSectionIdx !== null ? activeVeloroute.route[activeVelorouteSectionIdx] : null;
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const combinedVeloroute = useSelector(selectCombinedVeloroute);

    const hoverVeloStop = ({type}, spot) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(spot)) : dispatch(setActiveVelorouteStop(null))
    }

    const sectionHeadline = (stop, idx) => (
        <h3 
            className="veloroute-trainstops">
            <ActiveVelorouteSectionIcon num={idx}/>
            <span>
                { idx===1 ? labels[lang].from : labels[lang].to } { stop.stop_name }
                { stop.trainlines && 
                    stop.trainlines.map((s, i) => (
                    <span 
                        key={i}
                        className="train">{s}</span>))}
            </span>
        </h3>
    );
    return (<ScrollContent parentEl={parent} transitionComplete={true}>
        <div 
            id="veloroute"
            className="details"
        >
        { activeVelorouteSection && (
            <section className="veloroute-details veloroute-section-details">
                <h5>{`${labels[lang].leg}`}</h5>
                { sectionHeadline(activeVelorouteSection.leg[0], 1) }
                { sectionHeadline(activeVelorouteSection.leg[activeVelorouteSection.leg.length-1], 2) }
                { activeVelorouteSection.leg.length > 2 && (
                    <>
                    <h6>{labels[lang].via}</h6>
                    <ul className="veloroute-stops">
                        {activeVelorouteSection.leg
                            .slice(1,-1)
                            .map((s, idx, arr) => (<li key={idx}>
                                <span 
                                    className={activeVelorouteStop && activeVelorouteStop.stop_id===s.stop_id ? 'hover' : ''}
                                    onMouseEnter={e => hoverVeloStop(e, s)}
                                    onMouseLeave={hoverVeloStop}>
                                        {s.stop_name}</span>
                                { idx !== arr.length-1 && `, `}
                            </li>)
                        )}
                    </ul>
                </>)}       
                <h6>{labels[lang].distance}</h6>
                <p>{activeVelorouteSection.dist} km</p>
            </section>)}
            
            {combinedVeloroute && (
                <section>
                    <h5>{labels[lang].combined_veloroute}</h5>
                    <header>
                        <div className="details-headline">
                            <PinIcon size="small"><VelorouteIcon/></PinIcon>
                            <h3>{`${combinedVeloroute.veloroute_name}`}</h3>
                        </div>
                    </header>
            </section>)}
        </div>
    </ScrollContent>)
}