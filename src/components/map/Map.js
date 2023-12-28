import './map.scss';
import { useSpring, useTransition, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useZoom } from '../../hooks/useZoom';
import { 
    selectLang
} from '../../AppSlice';
import { 
    selectCurrentTrainroutes,
    selectTrainrouteListLoading
} from './trainroutes/TrainroutesSlice';
import { 
    selectActiveVeloroute 
} from './veloroutes/VeloroutesSlice';
import { Trainroutes } from './trainroutes/Trainroutes';
import { Germany } from './germany/Germany';
import { Loading } from '../stateless/loading/Loading';
import { ZoomPanel } from '../stateless/zoomPanel/ZoomPanel';

export const Map = ({
    value,
    mapContainer,
    mapSize,
    lang,
    fn,
    userScale
}) => {

    const mapcontainerRef = useRef(null);
    const labels = useSelector(selectLang);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const veloroute = useSelector(selectActiveVeloroute);

    const zoom = useZoom(journeys, veloroute, Number(value), mapContainer, mapSize, userScale, isLoading);
    const mapInnerSpring = useSpring({
        left: zoom.x,
        top: zoom.y
    });

    const loadingSpring = useTransition(isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: {
            tension: 280,
            friction: 60
        }
    });

    // drag feature
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    // Set the drag hook and define component movement based on gesture data.
    const bind = useDrag(({ movement: [mx, my] }) => {
        api.start({ x: mx, y: my })
    });

    useEffect(() => {
        api.start({ x: 0, y: 0 })
    },[value, api])

    return (<>
    { loadingSpring((styles, item) => item && (<animated.div className="loading" style={styles}><Loading lang={lang}/></animated.div>) )}
    <ZoomPanel fn={fn}/>
    <div 
        id="map-container" 
        ref={mapcontainerRef}
        style={{
            width: zoom.containerWidth,
            height: zoom.containerHeight,
            transform: `translate(-50%, -50%)`
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
                { !isLoading && (<>
                    {(parseInt(value)===0 && journeys.length===0 && !isLoading) && (<div className="instructions">
                        <p>{labels[lang].instruction}</p>
                    </div>)}
                    <Trainroutes 
                        zoom={zoom} />
                    </>)
                }
                <Germany/>
            </animated.div>
    </div>
    </>)
}