import './rangeinput.scss';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLang } from '../../../AppSlice';
import { getTime } from '../../../utils/getTime';

export const RangeInput = ({
    lang,
    min,
    max,
    value,
    step,
    handleInputChange,
    loadingSequenceActive
}) => {

    const ref = useRef(null);
    const labels = useSelector(selectLang);

    useEffect(() => {
        const trackLength = (value - min) * 100 / (max - min) + '% 100%';
        ref.current.style.backgroundSize = trackLength;
    },[value, min, max]);

    const skala = () => {
        const rangeSkala = [];
        for (let i = 0; i < max; i++){
            const hour = Math.floor(i / 2);
            const minute = i % 2 === 1 ? '30' : '00';
            const time = `${hour}:${minute}`;
            rangeSkala.push(<li key={i}>
                    <span>{time}</span>
                    {i===max-1 && <span className="end">{`${Math.floor((i+1) / 2)}:${(i+1) % 2 === 1 ? '30' : '00'}`}</span>}
                </li>)
        }
        return rangeSkala
    }

    return (<fieldset className={loadingSequenceActive ? 'range-slider disabled' : 'range-slider'}>
        <label htmlFor="fahrtzeit">{labels.traveltime[lang]}:</label>
        <span> {labels.upto[lang]} {getTime(value*30, lang)}</span>
        <div>
        <input 
            disabled={loadingSequenceActive ? true : false}
            ref={ref}
            type="range" 
            name="fahrtzeit"
            min={min} 
            max={max}
            value={value} 
            step={step}
            onChange={handleInputChange}/>
            <div className="rangeInputWrapper">
                <ul 
                    className="steps"
                    style={{
                        width: '100%'
                    }}>
                    {skala()}
                </ul>
            </div>
        </div>
        </fieldset>)
}