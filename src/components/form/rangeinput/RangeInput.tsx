import styles from "./rangeinput.module.scss";
import { useTranslation } from "../../../utils/i18n";
import { useRef, useEffect } from "react";
interface RangeInputProps {
    min: number;
    max: number;
    value: number;
    step: number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    makeScale?: (step: number, index: number) => string;
    getCurrentValue?: (val: number) => string;
}
export const RangeInput = ({
    min,
    max,
    value,
    step,
    handleInputChange,
    name,
    makeScale = (val) => val.toString(),
    getCurrentValue = (val: number) => val.toString(),
}: RangeInputProps) => {
    const ref = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!ref.current) return;
        const trackLength = ((value - min) * 100) / (max - min) + "% 100%";
        ref.current.style.backgroundSize = trackLength;
    }, [value, min, max]);

    return (
        <fieldset className={styles.rangeSlider}>
            <label htmlFor={name}>{name}:</label>
            <span>
                {" "}
                {t("upto")} {getCurrentValue(value)}
            </span>
            <div>
                <input
                    ref={ref}
                    type="range"
                    id={name}
                    name={name}
                    min={min}
                    max={max}
                    value={value}
                    step={step}
                    onChange={handleInputChange}
                />
                <div className={styles.rangeInputWrapper}>
                    <ul
                        className={styles.steps}
                        style={{
                            width: "100%",
                        }}
                    >
                        {new Array(max - min + step)
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
