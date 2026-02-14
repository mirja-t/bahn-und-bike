import { useLayoutEffect, useState } from "react";

export const useResponsiveSize = (element: HTMLElement | null) => {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    useLayoutEffect(() => {
        if (!element) return;
        
        // Set initial size before observing
        setSize({
            width: element.offsetWidth,
            height: element.offsetHeight,
        });
        
        const resizeObserver = new ResizeObserver(() => {
            setSize({
                width: element.offsetWidth,
                height: element.offsetHeight,
            });
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [element]);
    return size;
};
