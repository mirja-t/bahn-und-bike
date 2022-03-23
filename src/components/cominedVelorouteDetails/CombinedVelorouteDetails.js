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

    const hoverVeloStop = ({type}, id) => {
        type==='mouseenter' ? dispatch(setActiveVelorouteStop(id)) : dispatch(setActiveVelorouteStop(null))
    }


    return (<ScrollContent parentEl={parent} transitionComplete={true}>
        <div 
            id="veloroute"
            className="details"
        >
        { activeVelorouteSection && (
            <section className="veloroute-details veloroute-section-details">
                <h5>{`${labels[lang].leg}`}</h5>
                <h3 className="veloroute-trainstops">
                    <ActiveVelorouteSectionIcon num={1}/>
                    <span>
                        {`${labels[lang].from} ${activeVelorouteSection[0].stop_name}`} 
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
                        {`${labels[lang].to} ${activeVelorouteSection[activeVelorouteSection.length - 1].stop_name}`}
                        { activeVelorouteSection[activeVelorouteSection.length - 1].train_list.map((s, i) => (
                            <span 
                                key={i}
                                className="train">{s}</span>))}
                    </span>
                </h3>
                
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