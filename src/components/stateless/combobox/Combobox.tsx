import { useEffect, useId, useRef, useState } from "react";
import styles from "./combobox.module.scss";

const MIN_FILTER_LENGTH = 2;
const DEFAULT_MAX_LENGTH = 100;

interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    name: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
}

export const Combobox = ({
    options,
    name,
    label,
    value,
    onChange,
    placeholder,
    maxLength = DEFAULT_MAX_LENGTH,
}: ComboboxProps) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const listboxId = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions =
        inputValue.length >= MIN_FILTER_LENGTH
            ? options.filter((option) =>
                  option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
              )
            : [];

    const showDropdown = isOpen && filteredOptions.length > 0;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value.slice(0, maxLength);
        setInputValue(newValue);
        setIsOpen(true);
        onChange(newValue);
    };

    const handleOptionSelect = (option: ComboboxOption) => {
        setInputValue(option.label);
        setIsOpen(false);
        onChange(option.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        } else if (event.key === "ArrowDown" && showDropdown) {
            const firstOption = wrapperRef.current?.querySelector<HTMLElement>(
                `[role="option"]`,
            );
            firstOption?.focus();
        }
    };

    const handleOptionKeyDown = (
        event: React.KeyboardEvent<HTMLLIElement>,
        option: ComboboxOption,
        index: number,
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOptionSelect(option);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            const next = wrapperRef.current?.querySelectorAll<HTMLElement>(
                `[role="option"]`,
            )[index + 1];
            next?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (index === 0) {
                wrapperRef.current
                    ?.querySelector<HTMLElement>(`#${name}`)
                    ?.focus();
            } else {
                const prev = wrapperRef.current?.querySelectorAll<HTMLElement>(
                    `[role="option"]`,
                )[index - 1];
                prev?.focus();
            }
        } else if (event.key === "Escape") {
            setIsOpen(false);
            wrapperRef.current
                ?.querySelector<HTMLElement>(`#${name}`)
                ?.focus();
        }
    };

    const hasValue = inputValue.length > 0;

    return (
        <div className={styles.comboboxwrapper} ref={wrapperRef}>
            <fieldset className={hasValue ? styles.selected : ""}>
                {label && <label htmlFor={name}>{label}</label>}
                <input
                    type="text"
                    className={styles.input}
                    id={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-haspopup="listbox"
                />
                {showDropdown && (
                    <ul
                        className={styles.listbox}
                        id={listboxId}
                        role="listbox"
                        aria-label={label}
                    >
                        {filteredOptions.map((option, index) => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={option.label === inputValue}
                                className={[styles.option, option.label === inputValue ? styles.optionSelected : ""].filter(Boolean).join(" ")}
                                tabIndex={0}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleOptionSelect(option)}
                                onKeyDown={(e) =>
                                    handleOptionKeyDown(e, option, index)
                                }
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </fieldset>
        </div>
    );
};
