import { useSelector, useDispatch } from 'react-redux';
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { PinIcon } from '../stateless/icons/PinIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';
import { ActiveVelorouteSectionIcon } from './activeVelorouteSectionIcon/ActiveVelorouteSectionIcon';
import { selectLang } from '../../AppSlice';
import { useDistance } from '../../hooks/useDistance';
import { 
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
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const dist = useDistance(activeVelorouteSection);
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const combinedVeloroute = useSelector(selectCombinedVeloroute);

    const hoverVeloStop = ({type}, spot) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(spot)) : dispatch(setActiveVelorouteStop(null))
    }

    return (<ScrollContent parentEl={parent} transitionComplete={true}>
        <div 
            id="veloroute"
            className="details"
        >
        { activeVelorouteSection && (
            <section className="veloroute-details veloroute-section-details">
                <h5>{`${labels[lang].leg}`}</h5>
                { [activeVelorouteSection[0], activeVelorouteSection[activeVelorouteSection.length - 1]].map((stop, idx) => 
                    (<h3 
                        key={idx}
                        className="veloroute-trainstops">
                        <ActiveVelorouteSectionIcon num={idx + 1}/>
                        <span>
                            {`${idx===0 ? labels[lang].from : labels[lang].to} ${stop.stop_name}`}
                            { stop.trainstops && 
                                stop.trainstops.map((s, i) => (
                                <span 
                                    key={i}
                                    className="train">{s}</span>))}
                        </span>
                    </h3>)
                )}
                { activeVelorouteSection.length > 2 && (<>
                    <h6>{labels[lang].via}</h6>
                    <ul className="veloroute-stops">
                        {activeVelorouteSection.slice(1,activeVelorouteSection.length-1)
                            .filter((s, idx, arr) => s.stop_name !== arr[idx-1]?.stop_name)
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
                <h6>{`${labels[lang].distance} (${labels[lang].airline})`}</h6>
                <p>{dist} km</p>
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