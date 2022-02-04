import './rangeinput.scss';
import { useRef, useEffect } from 'react';

export const RangeInput = ({
    id,
    min,
    max,
    value,
    step,
    handleInputChange
}) => {

    const ref = useRef(null);

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

    return (<div className="range-slider">
        <input 
            ref={ref}
            type="range" 
            id={id} 
            name={id} 
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
        </div>)
}