import { useEffect, useState } from "react";

export const useResponsiveSize = (element: HTMLElement | null) => {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        if (!element) return;
        const resizeObserver = new ResizeObserver(() => {
            setSize({
                width: element.offsetWidth,
                height: element.offsetHeight,
            });
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.unobserve(element);
        };
    }, [element]);
    return size;
};
