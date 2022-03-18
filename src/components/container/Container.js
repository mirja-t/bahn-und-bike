import './container.scss';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from '../map/Map';
import { TravelDuration } from '../form/TravelDuration';
import { DestinationDetails } from '../destinationDetails/DestinationDetails';
import { VelorouteDetails } from '../velorouteDetails/VelorouteDetails';
import { 
    setUserScale
} from '../../AppSlice';
import { 
    selectTrainrouteList,
    selectActiveSection,
    setActiveSection,
    setCurrentTrainroutes,
    setTrainLinesAlongVeloroute,
    selectStartPos
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
import { weserLippe } from '../../data/veloroutes';

export const Container = ({lang}) => {

    const dispatch = useDispatch();
    const trainrouteList = useSelector(selectTrainrouteList);
    const activeDestination = useSelector(selectActiveDestination);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const startPos = useSelector(selectStartPos);
    const [value, setValue] = useState(0);
    const [submitVal, setSubmitVal] = useState(0);
    const [dimensions, setDimensions] = useState([0, 0]);
    const [containerHeight, setContainerHeight] = useState(0);
    const [wrapper, setWrapper] = useState(null);
    const [containerClass, setContainerClass] = useState('width-3');

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
        dispatch(setUserScale(1));
    }

    useEffect(()=>{
        const r1 = [];
        weserLippe.forEach((s, i) =>{
            let idxstr = i.toString()
            r1.push({
                id: parseInt('20' + idxstr.padStart(4, 0)),
                destination_id: s.stop_id,
                veloroute_id: 20,
                stop_number: i
            })
        })
        console.log(r1)
    },[]);

    useEffect(()=>{
        setSubmitVal(0);
        setValue(0);
    },[startPos]);

    useEffect(()=>{

        if(activeVeloroute){
            setContainerClass('width-1');
        }
        else if(activeDestination || activeSection){
            setContainerClass('width-2');
        }
        else {
            setContainerClass('width-3');
        }

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
                    lang={lang}/>
                <VelorouteDetails
                    parent={container.current}
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