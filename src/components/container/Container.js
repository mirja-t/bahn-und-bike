import './container.scss';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from '../map/Map';
import { TravelDuration } from '../form/TravelDuration';
import { DestinationDetails } from '../destinationDetails/DestinationDetails';
import { VelorouteDetails } from '../velorouteDetails/VelorouteDetails';
import { CombinedVelorouteDetails } from '../cominedVelorouteDetails/CombinedVelorouteDetails';
import { 
    selectActiveSection,
    setActiveSection,
    setTrainLinesAlongVeloroute,
    selectStartPos,
    loadTrainroutes
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveVeloroute,
    setActiveVeloroute,
    setActiveVelorouteSection,
    selectActiveVelorouteSection
} from '../map/veloroutes/VeloroutesSlice';
import { mapRatio } from '../../utils/svgMap';

export const Container = ({lang}) => {

    const dispatch = useDispatch();
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection = activeVelorouteSectionIdx !== null ? activeVeloroute.route[activeVelorouteSectionIdx] : null;
    const start = useSelector(selectStartPos);
    const [submitVal, setSubmitVal] = useState(0);
    const [mapSize, setMapSize] = useState([0, 0]);
    const [containerHeight, setContainerHeight] = useState(0);
    const [wrapper, setWrapper] = useState(null);
    const [containerClass, setContainerClass] = useState('width-3');
    const [userScale, setUserScale] = useState(1);

    const container = useRef(null);
    const prevValue = useRef(0);

    const memoizedMapSize = useMemo(() => mapSize, [mapSize]);
    const memoizedZoomMap = useCallback((dir) => {
        const factor = dir === '+' ? 1 : -1;
        setUserScale(userScale + factor * 0.2);
    }, [userScale]);
    
    const handleSubmit = (e, value, direct=true) => {

        e.preventDefault();
        prevValue.current = value;
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainLinesAlongVeloroute([]));
        setUserScale(1);
        dispatch(loadTrainroutes({start, value, direct}));
        setSubmitVal(value);
    }

    useEffect(()=>{

        if(activeVeloroute){
            setContainerClass('width-1');
        }
        else if(activeSection){
            setContainerClass('width-2');
        }
        else {
            setContainerClass('width-3');
        }

        if(activeVelorouteSection !== null && !activeSection) {
            setContainerClass(prev => `${prev} shift`);
        }

    },[activeVeloroute, activeSection, activeVelorouteSection]);

    useEffect(()=> {
        if(!wrapper) return

        const setSize = () => {
            const wrapperWidth = wrapper.getBoundingClientRect().width;
            const height = wrapperWidth / mapRatio;
            const width = wrapperWidth;
            setMapSize([
                width,
                height
            ])
        }

        setSize();
        window.addEventListener('resize', setSize);
        return () => {
            window.removeEventListener('resize', setSize);
        }
        
    },[wrapper]);

    useEffect(() => {
        if(!container) return
        
        const setHeight = () => { 
            const h = container.current.getBoundingClientRect().height;
            setContainerHeight(h) 
        }
        setHeight();
        window.addEventListener('resize', setHeight);
        return () => {
            window.removeEventListener('resize', setHeight);
        }
    }, []);

    return (<>
        <div 
            id="container" 
            ref={container} 
            style={{height: containerHeight}}
            className={containerClass}
            >
            <aside
                className="destination-details-container">
                <DestinationDetails
                    parent={container.current}
                    lang={lang}/>
                <VelorouteDetails
                    parent={container.current}
                    lang={lang}/>
                <CombinedVelorouteDetails
                    parent={container.current}
                    lang={lang}/>
            </aside>
            <main>
                <div id="map-wrapper" ref={setWrapper}>
                    <Map 
                        value={submitVal}
                        wrapper={wrapper}
                        mapSize={memoizedMapSize}
                        lang={lang}
                        fn={memoizedZoomMap}
                        userScale={userScale}
                        />
                </div>
            </main>
        </div>
        <TravelDuration
            handleSubmit={handleSubmit}
            lang={lang}
            start={start}/>
    </>)
}