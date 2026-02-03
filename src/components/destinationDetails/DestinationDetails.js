import './destinationDetails.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getTime } from '../../utils/getTime';
import { ScrollContent } from '../stateless/scrollcontent/ScrollContent';
import { selectLang } from '../../AppSlice';
import { 
    selectVelorouteList,
    selectActiveVeloroute,
    setActiveVelorouteSection,
    loadVeloroute
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectActiveSection,
    setTrainLinesAlongVeloroute
} from '../map/trainroutes/TrainroutesSlice';
import { PinIcon } from '../stateless/icons/PinIcon';
import { TrainIcon } from '../stateless/icons/TrainIcon';
import { ItemList } from '../stateless/itemlist/ItemList';

export const DestinationDetails = ({
    parent,
    lang
}) => {  
    
    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSection = useSelector(selectActiveSection);
    const veloroutes = useSelector(selectVelorouteList);

    const headline = activeSection ? `${labels[lang].from} ${activeSection?.firstStation.stop_name} ${labels[lang].to} ${activeSection?.lastStation.stop_name}` : null;
    const trainList = activeSection && activeSection.line.map((train, idx) => <span key={idx} className="train">{train}</span>);
    const initialTrains = activeSection && activeSection.connection && activeSection.connection.initial_train.map((train, idx) => <span key={idx} className="train">{train.name}</span>)
    const connectingTrain = activeSection && activeSection.connection && (<span className="train">{activeSection.connection.connecting_train.name}</span>)
    const train = (activeSection && activeSection.connection) ? (<>{initialTrains}<span className="train connection"> + </span>{connectingTrain}</>) : trainList;
    
    const dispatch = useDispatch();

    const setVelorouteActive = vroute => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVelorouteSection(null))
        dispatch(loadVeloroute(vroute))
    }

    return (<ScrollContent parentEl={parent} transitionComplete={true} >
        
        <div 
            id="destination"
            className="details">
            {activeSection && (<>
                <header>
                    <div className="details-headline">
                        <PinIcon>
                            <TrainIcon/>
                        </PinIcon>
                        <h2>{`${headline}  `}{train}</h2>
                    </div>
                </header>
                
                <section className="section">
                    <div>
                        <h5>{labels[lang].traveltime}</h5>
                        {activeSection && <p>{getTime(activeSection.dur, lang)}</p>}
                    </div>
                </section>

                { activeSection && activeSection.connection &&                
                    (<section className="section">
                        <div>
                            <h5>{labels[lang].trainconnection}</h5>
                            {activeSection && <p>{ activeSection.connection.stop_name }</p>}
                        </div>
                    </section>)
                }

                <section className="section">
                    <h5>{labels[lang].veloroutes}</h5>
                    <ItemList
                        items={veloroutes}
                        lang={lang}
                        activeItem={activeVeloroute}
                        fn={setVelorouteActive} />
                </section>
            </>)}
        </div>
    </ScrollContent>)
}
