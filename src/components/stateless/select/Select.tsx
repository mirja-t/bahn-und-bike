import { useEffect, useState } from "react";
import styles from "./select.module.scss";

interface Select {
    options: { value: string; label: string }[];
    label?: string;
    fn: (value: string) => void;

    readOnly?: boolean;
    preselectedValue?: string | undefined;
    disabled?: boolean;
    id?: string;
    required?: boolean;
    error?: string | string[];
}

export const Select = ({ options, label, fn, preselectedValue }: Select) => {
    const [selected, setSelected] = useState<{
        value: string;
        label: string;
    } | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        console.log("Selected value:", target.value);
        const selectedOption =
            options.find((option) => option.value === target.value) || null;
        setSelected(selectedOption);
        if (fn) fn(target.value);
    };

    useEffect(() => {
        if (preselectedValue) {
            const preselectedOption = options.find(
                (option) => option.value === preselectedValue,
            );
            setSelected(preselectedOption || null);
        }
    }, [preselectedValue, options]);

    return (
        <fieldset className={styles.fieldset}>
            <div
                className={
                    selected
                        ? `${styles.selected} ${styles.selectwrapper}`
                        : styles.selectwrapper
                }
            >
                {label && <label htmlFor={label}>{label}</label>}
                <select
                    className={styles.select}
                    id={label}
                    onChange={handleChange}
                    value={selected?.value || ""}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </fieldset>
    );
};
