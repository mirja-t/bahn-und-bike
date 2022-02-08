import './map.css';
import { useSpring, useTransition, animated } from 'react-spring';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useZoom } from '../../hooks/useZoom';
import { 
    selectLang, 
    selectLoadingSequenceActive,
    setLoadingSequenceActive 
} from '../../AppSlice';
import { selectCurrentTrainroutes } from './trainroutes/TrainroutesSlice';
import { Trainroutes } from './trainroutes/Trainroutes';
import { Germany } from './germany/Germany';
import { Bundeslaender } from './bundeslaender/Bundeslaender';
import { MapLegend } from './mapLegend/MapLegend';
import { Cities } from './cities/Cities';
import { selectTrainrouteListLoading } from './trainroutes/TrainroutesSlice';
import { Loading } from '../stateless/loading/Loading';

export const Map = ({
    value,
    wrapper,
    dimensions,
    lang
}) => {

    const dispatch = useDispatch();
    const mapcontainerRef = useRef(null);
    const loadingSequence = useSelector(selectLoadingSequenceActive);
    const labels = useSelector(selectLang);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const zoom = useZoom(mapcontainerRef, journeys, value, wrapper, dimensions);

    const mapInnerSpring = useSpring({
        left: zoom.x,
        top: zoom.y
    });

    const loadingSpring = useTransition(loadingSequence,{
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: {
            tension: 280,
            friction: 60
        },
        delay: loadingSequence ? 500 : 0
    });

    useEffect(()=>{
        if(isLoading) return
        const timer = setTimeout(() => { dispatch(setLoadingSequenceActive(false)) }, 3000);
        return () => { clearTimeout(timer) }
    },[dispatch, isLoading]);

    return (<div 
        id="map-container" 
        ref={mapcontainerRef}
        style={{
            width: zoom.containerWidth,
            height: zoom.containerHeight
        }}>
            
            <animated.div className="map-inner" style={mapInnerSpring}>
                { loadingSpring((styles, item) => item && (<animated.div className="loading" style={styles}><Loading lang={lang}/></animated.div>) )}
                { !isLoading && !loadingSequence && (<>
                    {(parseInt(value)===0 && journeys.length===0 && !isLoading) && (<div className="instructions">
                        <p>{labels.instruction[lang]}</p>
                    </div>)}
                    <Trainroutes 
                        zoom={zoom}
                        mapcontainerRef={mapcontainerRef.current} />
                    </>)
                }
                <Germany/>
                <Bundeslaender value={value}/>
                <MapLegend zoom={zoom} value={value}/>
                <Cities zoom={zoom} value={value}/>
            </animated.div>
    </div>)
}