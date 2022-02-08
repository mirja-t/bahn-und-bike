import './destinationDetails.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useSprings, animated } from 'react-spring';
import { getTime } from '../../utils/getTime';
import { ScrollContent } from '../stateless/scrollcontent/ScrollContent';
import { selectLang } from '../../AppSlice';
import { 
    selectVelorouteList,
    selectActiveVeloroute, 
    setActiveVelorouteSection,
    setActiveVeloroute,
    selectVeloroutesLoading
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
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';

export const DestinationDetails = ({
    parent,
    detailsActive,
    lang
}) => {  

    const dispatch = useDispatch();
    
    const labels = useSelector(selectLang);
    const activeDestination = useSelector(selectActiveDestination);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const veloroutes = useSelector(selectVelorouteList);
    const veloroutesLoading =  useSelector(selectVeloroutesLoading);

    const tripName = activeSection ? `${labels.from[lang]} ${activeSection?.firstStation.stop_name} ${labels.to[lang]} ${activeSection?.lastStation.stop_name}` : null;
    const headline = activeSection ? tripName : activeDestination?.stop_name;
    const trains = activeDestination?.trainlines.map((t, i) => (<span className="train" key={i}>{t}</span>));
    const train = activeSection && <span className="train">{activeSection.line}</span>;
    const trainList = train ? train : trains;

    const springs = useSprings(
        veloroutesLoading ? 0 : veloroutes.length,
        veloroutes.map((_, i) => ({
          delay: 250 * i,
          x: 0,
          opacity: 1,
          from: {
            x: 500,
            opacity: 0
          },
          config: {
            tension: 210,
            friction: 20
          }
        }))
      );

    const setVelorouteActive = vroute => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVelorouteSection(null))
        dispatch(setActiveVeloroute(vroute))
    }

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
                    {veloroutesLoading ? labels.loading[lang] :
                    (<ul className="destinationslist">
                        {veloroutes.length < 1 && (<li className="route">{`${labels.nomatch[lang]}`}</li>)}
                        {springs.map((styles, i) => (
                            <animated.li 
                                style={styles}
                                key={i}
                                onClick={() => setVelorouteActive(veloroutes[i])}
                                className={activeVeloroute && veloroutes[i].name===activeVeloroute?.name ? 'active' : ''}>
                                <VelorouteIcon/>
                                <h4 
                                    className="veloroute">
                                    {`${veloroutes[i].name}`}
                                </h4>
                            </animated.li>
                        ))}
                    </ul>)}
                </section>
        </div>
    </ScrollContent>)
}
