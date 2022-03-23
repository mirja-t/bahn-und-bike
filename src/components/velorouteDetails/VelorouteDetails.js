import './velorouteDetails.scss';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { selectLang } from '../../AppSlice';
import { 
    selectActiveVeloroute, 
    setActiveVelorouteSection,
    selectActiveVelorouteSection,
    setCombinedVeloroute,
    setHoveredVelorouteSection,
    selectCrossingVelorouteList,
    selectCrossingVeloroutesLoading,
    selectCombinedVeloroute,
    setVelorouteSectionActiveThunk
} from '../map/veloroutes/VeloroutesSlice';
import { 
    selectTrainrouteList,
    setTrainLinesAlongVeloroute
} from '../map/trainroutes/TrainroutesSlice';
import { generateTrainlinesAlongVeloroute } from '../../utils/generateTrainlinesAlongVeloroute';
import { PinIcon } from '../stateless/icons/PinIcon';
import { VelorouteIcon } from '../stateless/icons/VelorouteIcon';
import { Collapse } from '../stateless/collapse/Collapse';
import { ItemList } from '../stateless/itemlist/ItemList';

export const VelorouteDetails = ({
    parent, 
    lang
}) => {

    const dispatch = useDispatch();

    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSection = useSelector(selectActiveVelorouteSection);
    const trainrouteList = useSelector(selectTrainrouteList);
    const crossingVeloroutes = useSelector(selectCrossingVelorouteList);
    const crossingVeloroutesLoading = useSelector(selectCrossingVeloroutesLoading);
    const combinedVeloroute = useSelector(selectCombinedVeloroute);
    
    const setCurrentCombinedVeloroute = item => {
        const activeCombinedVRouteSection = item.route.reduce((acc, el)=> acc.concat(el),[]);
        const stopIds = [item.route[0][0].stop_id, item.route[1][item.route[1].length-1].stop_id];
        const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
        dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute))
        dispatch(setCombinedVeloroute(item));
        dispatch(setActiveVelorouteSection(activeCombinedVRouteSection));
    }

    const setVelorouteSectionActive = idx => {
        dispatch(setVelorouteSectionActiveThunk({trainrouteList, activeVeloroute, idx}))
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
                        <Collapse title={`${labels.cyclingroutelegs[lang]}`}>
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
                    { activeVelorouteSection && 
                        (<section className="section">
                            <h5>{labels.alternativeveloroutes[lang]}</h5>
                            { crossingVeloroutes && !crossingVeloroutesLoading &&
                                <ItemList
                                    items={crossingVeloroutes}
                                    lang={lang}
                                    activeItem={combinedVeloroute}
                                    fn={setCurrentCombinedVeloroute} />}
                        </section>)
                    }
                    {!activeVelorouteSection && labels.nolegchosen[lang]}
                </div>
            )}
        </div>
    </ScrollContent>)
}