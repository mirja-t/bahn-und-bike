import './routelist.scss';
import { useSprings, animated } from "react-spring";
import { useDispatch, useSelector } from 'react-redux';
import { VelorouteIcon } from '../../stateless/icons/VelorouteIcon';
import { selectLang } from '../../../AppSlice';
import { 
    setActiveVelorouteSection,
    setActiveVeloroute,
    setCombinedVeloroute
} from '../veloroutes/VeloroutesSlice';
import { 
    setTrainLinesAlongVeloroute
} from '../trainroutes/TrainroutesSlice';


export const RouteList = ({veloroutes, activeVeloroute, lang}) => {

    const dispatch = useDispatch();
    const labels = useSelector(selectLang);

    const setVelorouteActive = vroute => {
        dispatch(setTrainLinesAlongVeloroute([]))
        dispatch(setActiveVelorouteSection(null))
        dispatch(setActiveVeloroute(vroute))
        dispatch(setCombinedVeloroute(null))
    }

    const springs = useSprings(
        veloroutes.length,
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

    return (<ul className="destinationslist">
        {veloroutes.length < 1 && (<li className="route nomatch">{`${labels.nomatch[lang]}`}</li>)}
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
    </ul>)
}