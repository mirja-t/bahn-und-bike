import './destinationDetails.scss';
import { useSelector } from 'react-redux';
import { getTime } from '../../utils/getTime';
import { ScrollContent } from '../stateless/scrollcontent/ScrollContent';
import { selectLang } from '../../AppSlice';
import { 
    selectVelorouteList,
    selectActiveVeloroute,
    selectVeloroutesLoading
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectActiveSection
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveDestination
} from './DestinationDetailsSlice';
import { PinIcon } from '../stateless/icons/PinIcon';
import { TrainIcon } from '../stateless/icons/TrainIcon';
import { RouteList } from '../map/routelist/RouteList';

export const DestinationDetails = ({
    parent,
    lang
}) => {  

    
    const labels = useSelector(selectLang);
    const activeDestination = useSelector(selectActiveDestination);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSection = useSelector(selectActiveSection);
    const veloroutesLoading =  useSelector(selectVeloroutesLoading);
    const veloroutes = useSelector(selectVelorouteList);

    const tripName = activeSection ? `${labels.from[lang]} ${activeSection?.firstStation.stop_name} ${labels.to[lang]} ${activeSection?.lastStation.stop_name}` : null;
    const headline = activeSection ? tripName : activeDestination?.stop_name;
    const trains = activeDestination?.trainlines.map((t, i) => (<span className="train" key={i}>{t}</span>));
    const train = activeSection && <span className="train">{activeSection.line}</span>;
    const trainList = train ? train : trains;
    
    return (<ScrollContent parentEl={parent} transitionComplete={true} >
        
        <div 
            id="destination"
            className="details">
            {(activeDestination || activeSection) && (<>
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
                    {veloroutesLoading ? labels.loading[lang] :
                        <RouteList 
                            veloroutes={veloroutes} 
                            activeVeloroute={activeVeloroute}
                            lang={lang}/>
                    }
                </section>
            </>)}
        </div>
    </ScrollContent>)
}
