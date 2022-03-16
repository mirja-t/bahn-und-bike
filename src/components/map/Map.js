import './map.css';
import { useSpring, useTransition, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useZoom } from '../../hooks/useZoom';
import { 
    selectLang, 
    selectLoadingSequenceActive,
    setLoadingSequenceActive,
    selectUserScale,
    setUserScale
} from '../../AppSlice';
import { selectCurrentTrainroutes } from './trainroutes/TrainroutesSlice';
import { selectActiveVeloroute } from './veloroutes/VeloroutesSlice';
import { Trainroutes } from './trainroutes/Trainroutes';
import { Germany } from './germany/Germany';
import { Bundeslaender } from './bundeslaender/Bundeslaender';
import { MapLegend } from './mapLegend/MapLegend';
import { Cities } from './cities/Cities';
import { selectTrainrouteListLoading } from './trainroutes/TrainroutesSlice';
import { Loading } from '../stateless/loading/Loading';
import { ZoomPanel } from '../stateless/zoomPanel/ZoomPanel';

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
    const userScale = useSelector(selectUserScale);
    const veloroute = useSelector(selectActiveVeloroute);
    const zoom = useZoom(mapcontainerRef, journeys, veloroute, value, wrapper, dimensions, userScale);

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

    // set min time for loading animation
    useEffect(()=>{
        if(isLoading) return
        const timer = setTimeout(() => { dispatch(setLoadingSequenceActive(false)) }, 2000);
        return () => { clearTimeout(timer) }
    },[dispatch, isLoading]);

    // drag feature
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    // Set the drag hook and define component movement based on gesture data.
    const bind = useDrag(({ movement: [mx, my] }) => {
        api.start({ x: mx, y: my })
    });

    // zoom feature
    const zoomMap = (dir) => {
        const factor = dir === '+' ? 1 : -1;
        dispatch(setUserScale(userScale + factor * 0.2))
    }

    useEffect(() => {
        api.start({ x: 0, y: 0 })
    },[value, api])

    return (<>
    <ZoomPanel fn={zoomMap}/>
    <div 
        id="map-container" 
        ref={mapcontainerRef}
        style={{
            width: zoom.containerWidth,
            height: zoom.containerHeight
        }}>
            <animated.div 
                {...bind()} 
                style={{ 
                    x, 
                    y, 
                    touchAction: 'none', 
                    ...mapInnerSpring 
                }}
                className="map-inner" 
                >
                { loadingSpring((styles, item) => item && (<animated.div className="loading" style={styles}><Loading lang={lang}/></animated.div>) )}
                { !isLoading && !loadingSequence && (<>
                    {(parseInt(value)===0 && journeys.length===0 && !isLoading) && (<div className="instructions">
                        <p>{labels.instruction[lang]}</p>
                    </div>)}
                    <Trainroutes 
                        zoom={zoom} />
                    </>)
                }
                <Germany/>
                <Bundeslaender value={value}/>
                <MapLegend zoom={zoom} value={value}/>
                <Cities zoom={zoom} value={value}/>
            </animated.div>
    </div>
    </>)
}