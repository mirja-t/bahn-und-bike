import './travelduration.scss';
import { useSelector } from 'react-redux';
import { useTimeFormat } from '../../hooks/useTimeFormat';
import { RangeInput } from './rangeinput/RangeInput';
import { selectLang } from '../../AppSlice';

export const TravelDuration = ({handleSubmit, handleInputChange, rangeValue, lang}) => {

    const time = useTimeFormat(rangeValue * 30, lang);
    const labels = useSelector(selectLang);

    return (<form id="fahrtzeit" onSubmit={handleSubmit}>
        <fieldset className="duration">
            <div className="duration-label">
                <h5 htmlFor="fahrtzeit">{labels.traveltime[lang]}:</h5>
                <p className="val">{rangeValue < 7 ? `${labels.upto[lang]} ${time}` : `${time} ${labels.andmore[lang]}`}</p>
            </div>
            <RangeInput 
                type="range" 
                id="fahrtzeit" 
                min="0" 
                max="7" 
                value={rangeValue} 
                step="1"
                handleInputChange={handleInputChange}/>
            
        </fieldset>
        
        <input type="submit" value={labels.search[lang]}/>
      </form>)
}