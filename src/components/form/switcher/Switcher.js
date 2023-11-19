import './switcher.scss';
import { useState } from 'react';

export const Switcher = ({setValue, values}) => {

    const [checkedRadioBtn, setCheckedRadioBtn] = useState(values[0].value);

    const handleRadioChange = ({target}) => {
        setCheckedRadioBtn(target.value);
        setValue(target.value);
    }

    return (<form className="switcher">
        <fieldset className={checkedRadioBtn===values[0].value ? 'val-1' : 'val-2'}>
            <div className={`${checkedRadioBtn===values[0].value ? 'active inputRadiowrapper' : 'inputRadiowrapper'}`}>
                <input 
                    type="radio" 
                    id={values[0].value.toLowerCase()} 
                    name="language" 
                    value={values[0].value.toLowerCase()} 
                    checked={checkedRadioBtn===values[0].value} 
                    onChange={handleRadioChange}/>
                    <label htmlFor={values[0].value.toLowerCase()}>{values[0].label}</label>
            </div>
            <div className={`${checkedRadioBtn===values[1].value ? 'active inputRadiowrapper' : 'inputRadiowrapper'}`}>
                <input 
                    type="radio" 
                    id={values[1].value.toLowerCase()} 
                    name="language" 
                    value={values[1].value.toLowerCase()} 
                    checked={checkedRadioBtn===values[1].value} 
                    onChange={handleRadioChange}/>
                    <label htmlFor={values[1].value.toLowerCase()}>{values[1].label}</label>   
                 
            </div>
        </fieldset>
    </form>)
}