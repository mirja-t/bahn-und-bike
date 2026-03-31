import styles from "./travelduration.module.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "../../utils/i18n";
import { Button } from "../stateless/button/Button";
import { RangeInput } from "./rangeinput/RangeInput";
import { CheckBox } from "./checkBox/CheckBox";
import { DestinationPicker } from "./destinationPicker/DestinationPicker";
import { useSelector } from "react-redux";
import { selectSubmitValue } from "../../AppSlice";

interface TravelDurationProps {
    handleSubmit: (
        e: React.SubmitEvent<HTMLFormElement>,
        value: number,
        direct: boolean,
    ) => void;
}
export const TravelDuration = ({ handleSubmit }: TravelDurationProps) => {
    const submitValue = useSelector(selectSubmitValue);
    const { t } = useTranslation();
    const [value, setValue] = useState(0);
    const [direct, setDirect] = useState(false);

    const handleCheckboxChange = () => {
        setDirect((prev) => !prev);
    };

    const handleInputChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(target.value);
        setValue(val);
    };

    useEffect(() => {
        if (submitValue === 0) {
            setValue(0);
        }
    }, [submitValue]);

    return (
        <form
            className={styles.travelduration}
            name="travel duration form"
            onSubmit={(e) => handleSubmit(e, value, direct)}
        >
            <DestinationPicker />
            <CheckBox
                checked={direct}
                handleCheckboxChange={handleCheckboxChange}
                id={"directconnection"}
            />
            <RangeInput
                min={0}
                max={7}
                value={value}
                step={1}
                handleInputChange={handleInputChange}
            />
            <Button
                disabled={value === 0}
                variant="primary"
                type="submit"
                label={t("search")}
            />
        </form>
    );
};
