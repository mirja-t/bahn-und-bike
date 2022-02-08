import './container.scss';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from '../map/Map';
import { TravelDuration } from '../form/TravelDuration';
import { DestinationDetails } from '../destinationDetails/DestinationDetails';
import { VelorouteDetails } from '../velorouteDetails/VelorouteDetails';
import { 
    selectTrainrouteList,
    selectActiveSection,
    setActiveSection,
    setCurrentTrainroutes,
    setTrainLinesAlongVeloroute
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveVeloroute,
    setActiveVeloroute,
    setActiveVelorouteSection
} from '../map/veloroutes/VeloroutesSlice';
import {
    setActiveDestination,
    selectActiveDestination
} from '../destinationDetails/DestinationDetailsSlice';
import { generateCurrentTrainlines } from '../../utils/generateCurrentTrainlines';

export const Container = ({lang}) => {

    const dispatch = useDispatch();
    const trainrouteList = useSelector(selectTrainrouteList);
    const activeDestination = useSelector(selectActiveDestination);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);

    const [value, setValue] = useState(0);
    const [submitVal, setSubmitVal] = useState(0);
    const [dimensions, setDimensions] = useState([0, 0]);
    const [containerHeight, setContainerHeight] = useState(0);
    const [wrapper, setWrapper] = useState(null);
    const [containerClass, setContainerClass] = useState('width-3');

    const [destDetailsActive, setDestDetailsActive] = useState(false);
    const [veloDetailsActive, setVeloDetailsActive] = useState(false);

    const container = useRef(null);
    const prevValue = useRef(0);
    const direction = useRef(1);
    
    const handleInputChange = ({target}) => {
        const val = target.value;
        setValue(val);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        prevValue.current = value;
        const currTrains = generateCurrentTrainlines(trainrouteList, value);
        setSubmitVal(value);
        dispatch(setCurrentTrainroutes(currTrains));
        dispatch(setActiveDestination(null));
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainLinesAlongVeloroute([]));
    }

    useEffect(()=>{
        const asideWidth = activeVeloroute ? 'width-1' : 'width-2';
        const destDetailsState = (activeDestination || activeSection) ? true : false;
        const veloDetailsState = (activeVeloroute) ? true : false;
        const classes = (activeDestination || activeSection) ? asideWidth : 'width-3';

        setContainerClass(classes);
        const timer = setTimeout(()=>{
            setDestDetailsActive(destDetailsState);
            setVeloDetailsActive(veloDetailsState);
        },500);

        return ()=> clearTimeout(timer)
    },[activeVeloroute, activeDestination, activeSection]);

    useEffect(()=>{
        let dir = direction.current;
        if(value < prevValue.current) dir = -1;
        if(value > prevValue.current) dir = 1;
        direction.current = dir;
    },[value]);

    useEffect(()=> {
        if(!wrapper) return

        const setSize = () => {
            const wrapperWidth = wrapper.getBoundingClientRect().width;
            const wrapperHeight = wrapper.getBoundingClientRect().height;
            const ratio = wrapperWidth / 16 * 9 > wrapperHeight ? 'horizontal' : 'vertical';
            const height = ratio==='horizontal' ? wrapperWidth / 16 * 9 : wrapperHeight;
            const width = ratio==='horizontal' ? wrapperWidth : wrapperHeight / 9 * 16;

            setDimensions([
                width,
                height
            ])
        }

        setSize();
        window.addEventListener('resize', setSize);
        return () => {
            window.removeEventListener('resize', setSize);
        }
        
    },[wrapper, wrapper?.offsetWidth]);

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
                    detailsActive={destDetailsActive}
                    lang={lang}/>
                <VelorouteDetails
                    parent={container.current}
                    detailsActive={veloDetailsActive}
                    lang={lang}/>
            </aside>
            <main>
                <div id="map-wrapper" ref={setWrapper}>
                    <Map 
                        value={submitVal}
                        wrapper={wrapper}
                        dimensions={dimensions}
                        lang={lang}
                        />
                </div>
            </main>
        </div>
        <TravelDuration
            handleSubmit={handleSubmit}
            rangeValue={value}
            handleInputChange={handleInputChange}
            lang={lang}/>
    </>)
}