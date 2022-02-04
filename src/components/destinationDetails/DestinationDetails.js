import './destinationDetails.scss';
import { useDispatch, useSelector } from 'react-redux'
import { getTime } from '../../utils/functions';
import { ScrollContent } from '../stateless/scrollcontent/ScrollContent';
import { selectLang } from '../../AppSlice';
import { 
    selectVelorouteList,
    selectActiveVeloroute, 
    setActiveVelorouteSection,
    setActiveVeloroute
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectActiveSection,
    selectTrainrouteListLoading,
    setTrainLinesAlongVeloroute
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveDestination
} from './DestinationDetailsSlice';
import { PinIcon } from '../stateless/icons/PinIcon';
import { TrainIcon } from '../stateless/icons/TrainIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';

export const DestinationDetails = ({
    parent,
    detailsActive,
    lang
}) => {  

    const dispatch = useDispatch();
    
    const labels = useSelector(selectLang);
    const activeDestination = useSelector(selectActiveDestination);
    const {stop_name: stopName, trainlines} = activeDestination;
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const veloroutes = useSelector(selectVelorouteList);
    const isLoading =  useSelector(selectTrainrouteListLoading);

    const tripName = activeSection ? `${labels.from[lang]} ${activeSection?.firstStation.stop_name} ${labels.to[lang]} ${activeSection?.lastStation.stop_name}` : null;
    const headline = activeSection ? tripName : stopName;
    const trains = trainlines.map((t, i) => (<span className="train" key={i}>{t}</span>));
    const train = activeSection && <span className="train">{activeSection.line}</span>;
    const trainList = train ? train : trains;

    const setVelorouteActive = vroute => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVelorouteSection(null))
        dispatch(setActiveVeloroute(vroute))
    }

    const renderVeloroutes = veloroutes.map((el, i) => (
        <li 
            key={i}
            onClick={() => setVelorouteActive(el)}
            className={activeVeloroute && el.name===activeVeloroute?.name ? 'active' : ''}>
            <VelorouteIcon/>
            <h4 
                className="veloroute">
                {`${el.name}`}
            </h4>
        </li>
    ));
    
    return (<ScrollContent parentEl={parent} transitionComplete={detailsActive}>
        <div 
            id="destination"
            className="details">
            <header>
                <div className="details-headline">
                    <PinIcon><TrainIcon/></PinIcon>
                    <h2>{`${headline}  `}{trainList}</h2>
                </div>
            </header>
            
            {activeSection && <section className="section d-flex">
                <div className="duration-label">
                    <h5>{labels.traveltime[lang]}</h5>
                    {activeSection && <p>{getTime(activeSection.dur, lang)}</p>}
                </div>
                </section>}
                
                <section className="section">
                    <h5>{labels.veloroutes[lang]}</h5>
                    {isLoading ? 'loading...' : 
                    (<ul className="destinationslist">
                        {veloroutes.length < 1 && <li className="route">{`${labels.nomatch[lang]}`}</li>}
                        {renderVeloroutes}
                    </ul>)}
                </section>
        </div>
    </ScrollContent>)
}
