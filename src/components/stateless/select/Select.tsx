import { useEffect, useState } from "react";
import styles from "./select.module.scss";

interface Select<T> {
    options: {
        value: T;
        label: string;
    }[];
    name: string;
    label?: string;
    onChange?: (value: T) => void;

    readOnly?: boolean;
    preselectedValue?: T | undefined;
    disabled?: boolean;
    id?: string;
    required?: boolean;
    error?: string | string[];
}

export const Select = <T extends string>({
    options,
    name,
    label,
    onChange,
    preselectedValue,
}: Select<T>) => {
    const [selected, setSelected] = useState<{
        value: T;
        label: string;
    } | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        const selectedOption =
            options.find((option) => option.value === target.value) || null;
        setSelected(selectedOption);
        if (onChange && selectedOption) onChange(selectedOption.value);
    };

    useEffect(() => {
        if (preselectedValue && !selected) {
            const preselectedOption = options.find(
                (option) => option.value === preselectedValue,
            );
            setSelected(preselectedOption || null);
        }
    }, [preselectedValue, options, selected]);

    return (
        <div className={styles.selectwrapper}>
            <fieldset className={selected ? styles.selected : ""}>
                {label && <label htmlFor={name}>{label}</label>}
                <select
                    className={styles.select}
                    id={name}
                    onChange={handleChange}
                    value={selected?.value || ""}
                >
                    {!selected && !preselectedValue && (
                        <option key="empty" value="">
                            ---
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {/* spacer for fieldset: 
                if absolute positioned label is present 
                and exceeds the width of the longest option
                the spacer expands the fieldset width */}
                <div
                    style={{
                        width: label ? label.length + "ch" : "auto",
                    }}
                />
            </fieldset>
        </div>
    );
};
