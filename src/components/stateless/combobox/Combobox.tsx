import styles from "./combobox.module.scss";
import ScrollContainer from "../scrollcontainer/ScrollContainer";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const DEFAULT_MAX_LENGTH = 100;

export interface ComboboxOption<T> {
    value: T;
    label: string;
}

interface ComboboxProps<T> {
    options: ComboboxOption<T>[];
    name: string;
    label?: string;
    value?: ComboboxOption<T> | null;
    onChange: (value: ComboboxOption<T> | null) => void;
    onInputChange?: (inputVal: string) => void;
    placeholder?: string;
    maxLength?: number;
    dropdownPosition?: "bottom" | "top";
}

export const Combobox = <T,>({
    options,
    name,
    label,
    value,
    onChange,
    onInputChange,
    placeholder,
    maxLength = DEFAULT_MAX_LENGTH,
    dropdownPosition = "bottom",
}: ComboboxProps<T>) => {
    const [inputValue, setInputValue] = useState<ComboboxOption<T> | null>(
        null,
    );
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

    const handleClickOutside = useCallback(() => {
        setIsOpen(false);
        setIsFiltering(false);
    }, []);
    useClickOutside(wrapperRef, handleClickOutside);

    const displayedOptions = isFiltering
        ? options
              .filter((option) =>
                  option.label
                      .toLowerCase()
                      .includes(visibleValue.toLowerCase()),
              )
              .slice(0, maxLength)
        : options.slice(0, maxLength);

    const showDropdown = isOpen && displayedOptions.length > 0;

    const handleFocus = () => {
        setVisibleValue("");
        setIsOpen(true);
    };

    const handleBlur = (
        event: React.FocusEvent<HTMLInputElement>,
        label?: string,
    ) => {
        const nextFocused = event.relatedTarget as Node | null;

        if (nextFocused && wrapperRef.current?.contains(nextFocused)) {
            return;
        }

        if (
            inputValue &&
            !options.map((option) => option.label).includes(visibleValue)
        ) {
            setVisibleValue(label || inputValue?.label || "");
        }

        setIsOpen(false);
        setIsFiltering(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVisibleValue(event.target.value);
        setIsOpen(true);
        setIsFiltering(true);
        if (onInputChange) {
            onInputChange(event.target.value);
        }
    };

    const handleOptionSelect = (option: ComboboxOption<T>) => {
        setInputValue(option);
        setVisibleValue(option.label);
        onChange(option);
        handleBlur({} as React.FocusEvent<HTMLInputElement>, option.label);
        setIsOpen(false);
        setIsFiltering(false);
    };

    const handleCaretClick = () => {
        setIsFiltering(false);
        setIsOpen((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsOpen(false);
            setIsFiltering(false);
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            const firstOption =
                wrapperRef.current?.querySelector<HTMLElement>(
                    `[role="option"]`,
                );
            firstOption?.focus();
        }
    };

    const handleOptionKeyDown = (
        event: React.KeyboardEvent<HTMLLIElement>,
        option: ComboboxOption<T>,
        index: number,
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOptionSelect(option);
            setIsOpen(false);
            setIsFiltering(false);
        } else if (event.key === "ArrowDown") {
            setIsFiltering(true);
            event.preventDefault();
            const next =
                wrapperRef.current?.querySelectorAll<HTMLElement>(
                    `[role="option"]`,
                )[index + 1];
            next?.focus();
        } else if (event.key === "ArrowUp") {
            setIsFiltering(true);
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
            setIsFiltering(false);
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
                    onBlur={handleBlur}
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
                    <ScrollContainer
                        height="fit-content"
                        className={`${styles.listboxWrapper} ${listboxPositionClass}`}
                    >
                        <ScrollContainer.ScrollContent>
                            <ul
                                id={listboxId}
                                role="listbox"
                                aria-label={label}
                                className={styles.listbox}
                            >
                                {displayedOptions.map((option, index) => (
                                    <li
                                        key={`option-${option.value}`}
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
                                        onClick={() =>
                                            handleOptionSelect(option)
                                        }
                                        onKeyDown={(e) =>
                                            handleOptionKeyDown(
                                                e,
                                                option,
                                                index,
                                            )
                                        }
                                    >
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        </ScrollContainer.ScrollContent>
                    </ScrollContainer>
                )}
            </fieldset>
        </div>
    );
};
