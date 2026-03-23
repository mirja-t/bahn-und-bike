import { useEffect } from "react";

export const useClickOutside = <T extends HTMLElement | null>(
    ref: React.RefObject<T> | null,
    callback: () => void,
): void => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref?.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
};
