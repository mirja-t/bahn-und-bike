import './travelduration.scss';
import { useSelector } from 'react-redux';
import { RangeInput } from './rangeinput/RangeInput';
import { 
    selectLang,
    selectLoadingSequenceActive 
} from '../../AppSlice';
import { selectStartPos } from '../map/trainroutes/TrainroutesSlice';

export const TravelDuration = ({handleSubmit, handleInputChange, rangeValue, lang}) => {

    const labels = useSelector(selectLang);
    const startPos = useSelector(selectStartPos);
    const loadingSequenceActive = useSelector(selectLoadingSequenceActive);

    return (
        <form id="travelduration" onSubmit={handleSubmit}>
                <RangeInput 
                    lang={lang}
                    type="range" 
                    min="0" 
                    max="7" 
                    value={rangeValue} 
                    step="1"
                    handleInputChange={handleInputChange}
                    loadingSequenceActive={loadingSequenceActive}
                    reset={startPos}/>
            <input type="submit" value={labels.search[lang]} className={loadingSequenceActive ? 'disabled' : ''}/>
        </form>)
}