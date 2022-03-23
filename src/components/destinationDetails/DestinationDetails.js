import './destinationDetails.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getTime } from '../../utils/getTime';
import { ScrollContent } from '../stateless/scrollcontent/ScrollContent';
import { selectLang } from '../../AppSlice';
import { 
    selectVelorouteList,
    selectActiveVeloroute,
    selectVeloroutesLoading,
    setActiveVelorouteSection,
    setActiveVeloroute,
    setCombinedVeloroute
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectActiveSection,
    setTrainLinesAlongVeloroute
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveDestination
} from './DestinationDetailsSlice';
import { PinIcon } from '../stateless/icons/PinIcon';
import { TrainIcon } from '../stateless/icons/TrainIcon';
import { ItemList } from '../stateless/itemlist/ItemList';

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

    const tripName = activeSection ? `${labels[lang].from} ${activeSection?.firstStation.stop_name} ${labels[lang].to} ${activeSection?.lastStation.stop_name}` : null;
    const headline = activeSection ? tripName : activeDestination?.stop_name;
    const trains = activeDestination?.trainlines.map((t, i) => (<span className="train" key={i}>{t}</span>));
    const train = activeSection && <span className="train">{activeSection.line}</span>;
    const trainList = train ? train : trains;

    const dispatch = useDispatch();

    const setVelorouteActive = vroute => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVelorouteSection(null))
        dispatch(setActiveVeloroute(vroute))
        dispatch(setCombinedVeloroute(null))
    }

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
                
                {activeSection && 
                    <section className="section d-flex">
                        <div className="duration-label">
                            <h5>{labels[lang].traveltime}</h5>
                            {activeSection && <p>{getTime(activeSection.dur, lang)}</p>}
                        </div>
                    </section>
                }

                <section className="section">
                    <h5>{labels[lang].veloroutes}</h5>
                    {veloroutesLoading ? labels[lang].loading :
                        <ItemList
                            items={veloroutes}
                            lang={lang}
                            activeItem={activeVeloroute}
                            fn={setVelorouteActive} />
                    }
                </section>
            </>)}
        </div>
    </ScrollContent>)
}
