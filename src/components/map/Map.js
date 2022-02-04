import './map.css';
import { useSpring, animated } from 'react-spring';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useZoom } from '../../hooks/useZoom';
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
    dimensions
}) => {

    const mapcontainerRef = useRef(null);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const zoom = useZoom(mapcontainerRef, journeys, value, wrapper, dimensions);

    const mapInnerSpring = useSpring({
        left: zoom.x,
        top: zoom.y
    });

    return (<div 
        id="map-container" 
        ref={mapcontainerRef}
        style={{
            width: zoom.containerWidth,
            height: zoom.containerHeight
        }}>
            <animated.div className="map-inner" style={mapInnerSpring}>
                { isLoading ? <Loading/> : 
                    <Trainroutes 
                        zoom={zoom}
                        mapcontainerRef={mapcontainerRef.current} />
                }
                <Germany/>
                <Bundeslaender value={value}/>
                <MapLegend zoom={zoom} value={value}/>
                <Cities zoom={zoom} value={value}/>
            </animated.div>
    </div>)
}