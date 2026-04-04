import styles from "./rangeinput.module.scss";
import { useTranslation } from "../../../utils/i18n";
import { useRef, useEffect, useState, useId } from "react";
interface RangeInputProps {
    min: number;
    max: number;
    value: number;
    step: number;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRelease?: (
        e:
            | React.MouseEvent<HTMLInputElement>
            | React.TouchEvent<HTMLInputElement>,
    ) => void;
    id?: string;
    name: string;
    makeScale?: (step: number, index: number) => string;
    getCurrentValue?: (val: number) => string;
}
export const RangeInput = ({
    min,
    max,
    value,
    step,
    handleInputChange: handleInputChangeProp,
    onRelease,
    id: idProp,
    name,
    makeScale = (val) => val.toString(),
    getCurrentValue = (val: number) => val.toString(),
}: RangeInputProps) => {
    const [inputValue, setInputValue] = useState(0);
    const ref = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const { t } = useTranslation();

    useEffect(() => {
        if (!ref.current) return;
        const trackLength = ((inputValue - min) * 100) / (max - min) + "% 100%";
        ref.current.style.backgroundSize = trackLength;
    }, [inputValue, min, max]);

    useEffect(() => {
        setInputValue(Number.isFinite(value) ? value : min);
    }, [value, min]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(Number(e.target.value));
        if (handleInputChangeProp) {
            handleInputChangeProp(e);
        }
    };

    return (
        <fieldset className={styles.rangeSlider}>
            <label htmlFor={id}>{name}:</label>
            <span>
                {" "}
                {t("upto")} {getCurrentValue(inputValue)}
            </span>
            <div>
                <input
                    ref={ref}
                    type="range"
                    id={id}
                    name={id}
                    min={min}
                    max={max}
                    value={inputValue}
                    step={step}
                    onChange={handleInputChange}
                    onMouseUp={onRelease}
                    onTouchEnd={onRelease}
                />
                <div className={styles.rangeInputWrapper}>
                    <ul
                        className={styles.steps}
                        style={{
                            width: "100%",
                        }}
                    >
                        {new Array((max - min) / step + 1)
                            .fill(step)
                            .map((step, i) => step * i + min)
                            .map(makeScale)
                            .map((str, i, arr) => {
                                if (i === arr.length - 1) return null;
                                return (
                                    <li key={i}>
                                        <span>{str}</span>
                                        {i === max - min - step && (
                                            <span className={styles.end}>
                                                {arr[i + 1]}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </fieldset>
    );
};
