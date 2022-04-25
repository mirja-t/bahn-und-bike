import './travelduration.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RangeInput } from './rangeinput/RangeInput';
import { 
    selectLang
} from '../../AppSlice';
import { 
    selectStartPos
} from '../map/trainroutes/TrainroutesSlice';
import { CheckBox } from './checkBox/CheckBox';
import { Button } from '../stateless/button/Button';

export const TravelDuration = ({handleSubmit, lang}) => {

    const labels = useSelector(selectLang);
    const startPos = useSelector(selectStartPos);
    const [value, setValue] = useState(0);
    const [direct, setDirect] = useState(true);

    const handleCheckboxChange = () => {
        setDirect(prev => !prev);
    }

    const handleInputChange = ({target}) => {
        const val = target.value;
        setValue(val);
    }

    return (
        <form id="travelduration" onSubmit={e => handleSubmit(e, value, direct)}>
            <div className="traveldurationWrapper">
                <CheckBox
                    lang={lang}
                    labels={labels}
                    value={direct} 
                    handleCheckboxChange={handleCheckboxChange}/>
                <RangeInput 
                    labels={labels}
                    lang={lang}
                    type="range" 
                    min="0" 
                    max="7" 
                    value={value} 
                    step="1"
                    handleInputChange={handleInputChange}
                    reset={startPos}/>
            </div>
            <Button label={labels[lang].search} type="submit"/>
            
        </form>)
}