import { useEffect, useId, useRef, useState } from "react";
import styles from "./combobox.module.scss";

const MIN_FILTER_LENGTH = 2;
const DEFAULT_MAX_LENGTH = 100;
const MAX_UNFILTERED_OPTIONS = 10;

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    name: string;
    label?: string;
    value: ComboboxOption | null;
    onChange: (value: ComboboxOption | null) => void;
    placeholder?: string;
    maxLength?: number;
    dropdownPosition?: "bottom" | "top";
}

export const Combobox = ({
    options,
    name,
    label,
    value,
    onChange,
    placeholder,
    maxLength = DEFAULT_MAX_LENGTH,
    dropdownPosition = "bottom",
}: ComboboxProps) => {
    const [inputValue, setInputValue] = useState<ComboboxOption | null>(null);
    const [visibleValue, setVisibleValue] = useState<string>(
        value?.label || "",
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const listboxId = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value?.value && !inputValue) {
            setInputValue(value);
            setVisibleValue(value.label);
        }
    }, [value, inputValue]);

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

    const displayedOptions =
        isFiltering && visibleValue.length >= MIN_FILTER_LENGTH
            ? options.filter((option) =>
                  option.label
                      .toLowerCase()
                      .includes(visibleValue.toLowerCase()),
              )
            : options.slice(0, MAX_UNFILTERED_OPTIONS);

    const showDropdown = isOpen && displayedOptions.length > 0;

    const handleFocus = () => {
        setVisibleValue("");
        setIsOpen(true);
    };

    const handleBlur = (label?: string) => {
        if (
            inputValue &&
            !options.map((option) => option.label).includes(visibleValue)
        ) {
            setVisibleValue(label || inputValue?.label || "");
        }
        setIsFiltering(false);
        setIsOpen(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVisibleValue(event.target.value);
        setIsOpen(true);
        const newValue = options.find((option) =>
            option.label
                .toLowerCase()
                .includes(event.target.value.toLowerCase()),
        );
        if (!newValue) return;
        setIsFiltering(newValue?.label.length >= MIN_FILTER_LENGTH);
        onChange(newValue);
    };

    const handleOptionSelect = (option: ComboboxOption) => {
        setInputValue(option);
        setVisibleValue(option.label);
        onChange(option);
        handleBlur(option.label);
    };

    const handleCaretClick = () => {
        setIsFiltering(false);
        setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsOpen(false);
        } else if (event.key === "ArrowDown" && showDropdown) {
            const firstOption =
                wrapperRef.current?.querySelector<HTMLElement>(
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
            const next =
                wrapperRef.current?.querySelectorAll<HTMLElement>(
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
                const prev =
                    wrapperRef.current?.querySelectorAll<HTMLElement>(
                        `[role="option"]`,
                    )[index - 1];
                prev?.focus();
            }
        } else if (event.key === "Escape") {
            setIsOpen(false);
            wrapperRef.current?.querySelector<HTMLElement>(`#${name}`)?.focus();
        }
    };

    const listboxPositionClass =
        dropdownPosition === "top" ? styles.listboxTop : styles.listboxBottom;

    return (
        <div className={styles.comboboxwrapper} ref={wrapperRef}>
            <fieldset className={!!inputValue ? styles.selected : ""}>
                {label && <label htmlFor={name}>{label}</label>}
                <input
                    type="text"
                    className={styles.input}
                    id={name}
                    value={visibleValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={() => handleBlur()}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-haspopup="listbox"
                />
                <button
                    type="button"
                    className={styles.caretButton}
                    onClick={handleCaretClick}
                    aria-label={
                        isOpen ? "Close suggestions" : "Open suggestions"
                    }
                    tabIndex={-1}
                />
                {showDropdown && (
                    <ul
                        className={`${styles.listbox} ${listboxPositionClass}`}
                        id={listboxId}
                        role="listbox"
                        aria-label={label}
                    >
                        {displayedOptions.map((option, index) => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={
                                    option.value === inputValue?.value
                                }
                                className={[
                                    styles.option,
                                    option.value === inputValue?.value
                                        ? styles.optionSelected
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
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
