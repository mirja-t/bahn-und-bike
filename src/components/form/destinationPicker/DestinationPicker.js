
import './destinationpicker.scss';
import { useSelector, useDispatch } from 'react-redux';
import { selectLang } from '../../../AppSlice';
import { 
    setStartPos
} from '../../map/trainroutes/TrainroutesSlice';

const startDest = {
    berlin: ['8011160', '8098160', '8011306', '8011118', '8011113', '8011102', '8011162', '8010036'],
    hameln: ['NDS000110215']
}

export const DestinationPicker = ({lang}) => {
    const dispatch = useDispatch();
    const labels = useSelector(selectLang);

    const handleChange = ({target}) => {
        const start = startDest[target.value];
        dispatch(setStartPos(start));
    }

    return (
    <fieldset className="startdestination">
        <label htmlFor="startdest">{labels[lang].startdest}:</label>
        <div className="selectwrapper">
            <select 
                name="dest" 
                id="startdest" 
                onChange={handleChange}>
                <option value="berlin">Berlin</option>
                <option value="hameln">Hameln</option>
            </select>
        </div>
    </fieldset>)
}