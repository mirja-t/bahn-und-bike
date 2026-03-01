import "./travelduration.scss";
import { useState } from "react";
import { useTranslation } from "../../utils/i18n";
import { Button } from "../stateless/button/Button";
import { RangeInput } from "./rangeinput/RangeInput";
import { CheckBox } from "./checkBox/CheckBox";
import { DestinationPicker } from "./destinationPicker/DestinationPicker";

interface TravelDurationProps {
    handleSubmit: (
        e: React.SubmitEvent<HTMLFormElement>,
        value: number,
        direct: boolean,
    ) => void;
}
export const TravelDuration = ({ handleSubmit }: TravelDurationProps) => {
    const { t } = useTranslation();
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
            <DestinationPicker />
            <CheckBox
                value={direct}
                handleCheckboxChange={handleCheckboxChange}
            />
            <RangeInput
                min={0}
                max={7}
                value={value}
                step={1}
                handleInputChange={handleInputChange}
            />
            <Button variant="primary" type="submit" label={t("search")} />
        </form>
    );
};
