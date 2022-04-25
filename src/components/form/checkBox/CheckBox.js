
import './checkbox.scss';
import { animated, useSpring } from 'react-spring';

export const CheckBox = ({
    lang,
    labels, 
    value,
    handleCheckboxChange
}) => {

    const unchecked = "11.3,15 15,15 18.7,15 "
    const checked = "9.3,15 13.3,19 21.8,9.8 "

    const animatedProps = useSpring({
        d: value ?
        checked : unchecked
    });

    return (
    <fieldset className="directconnection">
        <label htmlFor="directconnection">{labels[lang].direct_trains_only}</label>
        <div className={value ? 'active inputCheckbox' : 'inputCheckbox'}>
            <svg className={value ? 'active check' : 'check'} xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30">
                <animated.polyline fill="none" strokeWidth="3" stroke="red" points={animatedProps.d} />
            </svg>
            <input 
                id="directconnection" 
                name="directconnection" 
                type="checkbox"
                checked={value}
                onChange={handleCheckboxChange}
                />
        </div>
    </fieldset>)
}