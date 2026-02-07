import type { Labels, LangCode } from "../../../AppSlice";
import { getTime } from "../../../utils/getTime";
import "./rangeinput.scss";
import { useRef, useEffect } from "react";
interface RangeInputProps {
    lang: LangCode;
    labels: Labels;
    min: number;
    max: number;
    value: number;
    step: number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const RangeInput = ({
    lang,
    labels,
    min,
    max,
    value,
    step,
    handleInputChange,
}: RangeInputProps) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const trackLength = ((value - min) * 100) / (max - min) + "% 100%";
        ref.current.style.backgroundSize = trackLength;
    }, [value, min, max]);

    const skala = () => {
        const rangeSkala = [];
        for (let i = 0; i < max; i++) {
            const hour = Math.floor(i / 2);
            const minute = i % 2 === 1 ? "30" : "00";
            const time = `${hour}:${minute}`;
            rangeSkala.push(
                <li key={i}>
                    <span>{time}</span>
                    {i === max - 1 && (
                        <span className="end">{`${Math.floor((i + 1) / 2)}:${(i + 1) % 2 === 1 ? "30" : "00"}`}</span>
                    )}
                </li>,
            );
        }
        return rangeSkala;
    };

    return (
        <fieldset className="range-slider">
            <label htmlFor="fahrtzeit">{labels[lang].traveltime}:</label>
            <span>
                {" "}
                {labels[lang].upto} {getTime(value * 30, lang)}
            </span>
            <div>
                <input
                    ref={ref}
                    type="range"
                    name="fahrtzeit"
                    min={min}
                    max={max}
                    value={value}
                    step={step}
                    onChange={handleInputChange}
                />
                <div className="rangeInputWrapper">
                    <ul
                        className="steps"
                        style={{
                            width: "100%",
                        }}
                    >
                        {skala()}
                    </ul>
                </div>
            </div>
        </fieldset>
    );
};
