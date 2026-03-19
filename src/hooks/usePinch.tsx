import { useEffect, useRef } from "react";

const getPinchDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Enables pinch-to-zoom on a container element.
 *
 * Handles two gesture types:
 * - Two-finger touch pinch (mobile / touch screens)
 * - Wheel events with `ctrlKey` set (trackpad pinch on desktop)
 *
 * The hook is intentionally side-effect-only; the caller owns the scale
 * state and provides a setter so that pinch gestures stay in sync with
 * other zoom controls (e.g. ZoomPanel buttons).
 *
 * @param containerRef - Ref to the element that should receive the listeners.
 * @param scale        - Current scale value (kept in sync via a ref so stale
 *                       closures inside the stable effect are avoided).
 * @param setScale     - Setter that updates the scale in the caller.
 */
export const usePinch = (
    containerRef: React.RefObject<HTMLElement | null>,
    scale: number,
    setScale: (newScale: number) => void,
): void => {
    // Mirror mutable values in refs so the stable effect closure always
    // reads up-to-date values without being recreated on every render.
    const currentScaleRef = useRef<number>(scale);
    const setScaleRef = useRef<(newScale: number) => void>(setScale);
    const initialPinchDistance = useRef<number | null>(null);
    const scaleAtPinchStart = useRef<number>(scale);

    currentScaleRef.current = scale;
    setScaleRef.current = setScale;

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                initialPinchDistance.current = getPinchDistance(e.touches);
                scaleAtPinchStart.current = currentScaleRef.current;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (
                e.touches.length === 2 &&
                initialPinchDistance.current !== null
            ) {
                const newDist = getPinchDistance(e.touches);
                const ratio = newDist / initialPinchDistance.current;
                const newScale = Math.max(
                    0.1,
                    scaleAtPinchStart.current * ratio,
                );
                setScaleRef.current(newScale);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                initialPinchDistance.current = null;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (!e.ctrlKey) return;
            e.preventDefault();
            const step = e.deltaY > 0 ? -0.2 : 0.2;
            setScaleRef.current(
                Math.max(
                    0.1,
                    Number((currentScaleRef.current + step).toFixed(1)),
                ),
            );
        };

        element.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });
        element.addEventListener("touchmove", handleTouchMove, {
            passive: true,
        });
        element.addEventListener("touchend", handleTouchEnd, {
            passive: true,
        });
        // passive: false required so we can call preventDefault() and stop the
        // browser from zooming the whole page on trackpad pinch.
        element.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
            element.removeEventListener("wheel", handleWheel);
        };
        // containerRef object identity is stable (same ref across renders);
        // scale / setScale are accessed through their refs above.
    }, [containerRef]);
};
