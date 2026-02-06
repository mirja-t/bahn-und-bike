import "./travelduration.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectLang } from "../../AppSlice";
import { Button } from "../stateless/button/Button";
import { RangeInput } from "./rangeinput/RangeInput";
import { CheckBox } from "./checkBox/CheckBox";
//import { DestinationPicker } from './destinationPicker/DestinationPicker';

interface TravelDurationProps {
    lang: string;
    start: any;
    handleSubmit: (
        e: React.FormEvent<HTMLFormElement>,
        value: number,
        direct: boolean,
    ) => void;
}
export const TravelDuration = ({
    handleSubmit,
    lang,
    start,
}: TravelDurationProps) => {
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
            <div className="traveldurationWrapper">
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
                    // reset={start} // reset value when start changes --> fix
                />
            </div>
            <Button label={labels[lang].search} type="submit" />
        </form>
    );
};
