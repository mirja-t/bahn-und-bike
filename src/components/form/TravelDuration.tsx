import "./travelduration.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { LangCode, selectLang } from "../../AppSlice";
import { Button } from "../stateless/button/Button";
import { RangeInput } from "./rangeinput/RangeInput";
import { CheckBox } from "./checkBox/CheckBox";

interface TravelDurationProps {
    lang: LangCode;
    handleSubmit: (
        e: React.SubmitEvent<HTMLFormElement>,
        value: number,
        direct: boolean,
    ) => void;
}
export const TravelDuration = ({ handleSubmit, lang }: TravelDurationProps) => {
    const labels = useSelector(selectLang);
    const [value, setValue] = useState(0);
    const [direct, setDirect] = useState(true);

    const handleCheckboxChange = () => {
        setDirect((prev) => !prev);
    };

    const handleInputChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(target.value);
        setValue(val);
    };

    return (
        <form
            id="travelduration"
            onSubmit={(e) => handleSubmit(e, value, direct)}
        >
            {/* <DestinationPicker
                    labels={labels}
                    lang={lang}/> */}
            <CheckBox
                lang={lang}
                labels={labels}
                value={direct}
                handleCheckboxChange={handleCheckboxChange}
            />
            <RangeInput
                labels={labels}
                lang={lang}
                min={0}
                max={7}
                value={value}
                step={1}
                handleInputChange={handleInputChange}
            />
            <Button
                variant="primary"
                type="submit"
                label={labels[lang].search}
            />
        </form>
    );
};
