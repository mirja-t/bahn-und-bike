import { useEffect, useState } from "react";
export const usePinch = (
    containerRef: React.RefObject<HTMLElement | null>,
): {
    deltaX: number;
    deltaY: number;
    offsetX: number;
    offsetY: number;
} => {
    const [scale, setScale] = useState({
        deltaX: 0,
        deltaY: 0,
        offsetX: 0,
        offsetY: 0,
    });

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey) return;
            e.preventDefault();
            setScale({
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                offsetX: e.offsetX,
                offsetY: e.offsetY,
            });
        };
        element.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            element.removeEventListener("wheel", handleWheel);
        };
    }, [containerRef]);
    return scale;
};
