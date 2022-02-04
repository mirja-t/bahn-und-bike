import './container.scss';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { selectLang } from '../../AppSlice';
import { Map } from '../map/Map';
import { Footer } from '../stateless/footer/Footer';
import { TravelDuration } from '../form/TravelDuration';
import { DestinationDetails } from '../destinationDetails/DestinationDetails';
import { VelorouteDetails } from '../velorouteDetails/VelorouteDetails';
import { 
    selectTrainrouteList,
    selectTrainrouteListLoading,
    selectActiveSection,
    setActiveSection,
    setCurrentTrainroutes,
    selectCurrentTrainroutes
} from '../map/trainroutes/TrainroutesSlice';
import { 
    selectActiveVeloroute,
    setActiveVeloroute,
    setActiveVelorouteSection
} from '../map/veloroutes/VeloroutesSlice';
import {
    setActiveDestination,
    selectActiveDestinationId
} from '../destinationDetails/DestinationDetailsSlice';
import { generateCurrentTrainlines } from '../../utils/generateCurrentTrainlines';

export const Container = ({lang}) => {

    const dispatch = useDispatch();
    const labels = useSelector(selectLang);
    const trainrouteList = useSelector(selectTrainrouteList);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const activeDestination = useSelector(selectActiveDestinationId);
    const activeSection = useSelector(selectActiveSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const currentTrainRoutes = useSelector(selectCurrentTrainroutes);

    const [value, setValue] = useState(0);
    const [submitVal, setSubmitVal] = useState(0);
    const [dimensions, setDimensions] = useState([0, 0]);
    const [containerHeight, setContainerHeight] = useState(0);
    const [wrapper, setWrapper] = useState(null);

    const [destDetailsActive, setDestDetailsActive] = useState(false);
    const [veloDetailsActive, setVeloDetailsActive] = useState(false);

    const container = useRef(null);
    const prevValue = useRef(0);
    const direction = useRef(1);

    const asideWidth = activeVeloroute ? '100vw' : '125vw';

    const handleDetailsState = () => {
        const destDetailsState = (activeDestination || activeSection) ? true : false;
        setDestDetailsActive(destDetailsState);
        const veloDetailsState = (activeVeloroute) ? true : false;
        setVeloDetailsActive(veloDetailsState);
    }
    const containerStyles = useSpring({
        width: (activeDestination || activeSection) ? asideWidth : '150vw',
        onRest: () => { handleDetailsState() }
    });

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
    }

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
        {(parseInt(value)===0 && currentTrainRoutes.length===0 && !isLoading) && (<div className="instructions">
            <p>{labels.instruction[lang]}</p>
        </div>)}
        <animated.div 
            id="container" 
            ref={container} 
            style={{...containerStyles, height: containerHeight}}
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
                        />
                </div>
            </main>
        </animated.div>
        <Footer>
            <TravelDuration
                handleSubmit={handleSubmit}
                rangeValue={value}
                handleInputChange={handleInputChange}
                lang={lang}/>
        </Footer></>)
}