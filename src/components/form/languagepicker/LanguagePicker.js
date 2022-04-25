import './languagepicker.scss';
import { useState } from 'react';

export const LanguagePicker = ({setLanguage}) => {

    const [checkedRadioBtn, setCheckedRadioBtn] = useState('de');

    const handleRadioChange = ({target}) => {
        setCheckedRadioBtn(target.value);
        setLanguage(target.value);
    }

    return (<form id="language-picker">
        <fieldset className={checkedRadioBtn}>
            <div className={`${checkedRadioBtn==='de' ? 'active inputRadiowrapper' : 'inputRadiowrapper'}`}>
                <input 
                    type="radio" 
                    id="de" 
                    name="language" 
                    value="de" 
                    checked={checkedRadioBtn==='de'} 
                    onChange={handleRadioChange}/>
                    <label htmlFor="de">DE</label>
                
            </div>
            <div className={`${checkedRadioBtn==='en' ? 'active inputRadiowrapper' : 'inputRadiowrapper'}`}>
                <input 
                    type="radio" 
                    id="en" 
                    name="language" 
                    value="en" 
                    checked={checkedRadioBtn==='en'} 
                    onChange={handleRadioChange}/>  
                    <label htmlFor="en">EN</label>     
                 
            </div>
        </fieldset>
    </form>)
}