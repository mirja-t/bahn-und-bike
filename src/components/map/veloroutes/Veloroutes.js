import './veloroutes.scss';
import { 
    useSelector 
} from 'react-redux';
import {     
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    selectCombinedVeloroute
} from './VeloroutesSlice';
import { AlternativeRoute } from './alternativeroute/AlternativeRoute';
import { VelorouteStop } from './velorouteStop/VelorouteStop';
import { VeloroutePath } from './veloroutePath/veloroutePath';
import { ActiveVelorouteSectionIcon } from './activeVelorouteSectionDetails/ActiveVelorouteSectionIcon';

export const Veloroutes = ({strokeScale}) => {

    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection = activeVelorouteSectionIdx !== null ? activeVeloroute.route[activeVelorouteSectionIdx] : null;
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const combinedVeloroute = useSelector(selectCombinedVeloroute);
    const activeVRouteStops = {
        start: activeVelorouteSection ? activeVelorouteSection.leg[0] : null,
        end: activeVelorouteSection ? activeVelorouteSection.leg[activeVelorouteSection.leg.length-1] : null
    }

    return (<g 
        className="veloroute" > 
        { activeVeloroute.path.map((path, idx) => (
            <VeloroutePath
                key={idx}
                idx={idx}
                path={path}
                strokeScale={strokeScale}/>
        ))}

        { activeVeloroute.route.map(s => s.leg.map((item, idx) => (
            <VelorouteStop 
                key={idx}
                item={item}
                activeSpot={activeVelorouteStop}
                strokeScale={strokeScale}
                type={item===activeVRouteStops.start || item===activeVRouteStops.end ? 'active' : ''}
                />
        )))}

        { activeVelorouteSection && (<>
            {combinedVeloroute && (
                <AlternativeRoute 
                    altroute={combinedVeloroute}
                    strokeScale={strokeScale}/>
            )}
            <ActiveVelorouteSectionIcon 
                strokeScale={strokeScale}
                section={activeVelorouteSection.leg}/>
        </>)}
    </g>)
}