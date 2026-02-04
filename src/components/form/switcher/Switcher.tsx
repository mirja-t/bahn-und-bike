import "./switcher.scss";
import React, { useState } from "react";

interface SwitcherProps<T> {
    setValue: (value: T) => void;
    values: { label: string | React.ReactNode; value: T }[];
}

export const Switcher = <T,>({ setValue, values }: SwitcherProps<T>) => {
    const [checkedRadioBtn, setCheckedRadioBtn] = useState(values[0].value);

    const handleRadioChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedRadioBtn(target.value);
        setValue(target.value);
    };

    return (
        <form className="switcher">
            <fieldset
                className={
                    checkedRadioBtn === values[0].value ? "val-1" : "val-2"
                }
            >
                <div
                    className={`${checkedRadioBtn === values[0].value ? "active inputRadiowrapper" : "inputRadiowrapper"}`}
                >
                    <input
                        type="radio"
                        id={values[0].value.toLowerCase()}
                        name="language"
                        value={values[0].value.toLowerCase()}
                        checked={checkedRadioBtn === values[0].value}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor={values[0].value.toLowerCase()}>
                        {values[0].label}
                    </label>
                </div>
                <div
                    className={`${checkedRadioBtn === values[1].value ? "active inputRadiowrapper" : "inputRadiowrapper"}`}
                >
                    <input
                        type="radio"
                        id={values[1].value.toLowerCase()}
                        name="language"
                        value={values[1].value.toLowerCase()}
                        checked={checkedRadioBtn === values[1].value}
                        onChange={handleRadioChange}
                    />
                    <label htmlFor={values[1].value.toLowerCase()}>
                        {values[1].label}
                    </label>
                </div>
            </fieldset>
        </form>
    );
};
