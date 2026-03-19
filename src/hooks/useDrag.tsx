import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface DragValues {
    x: MotionValue<number>;
    y: MotionValue<number>;
}

export const useDrag = (resetKey: unknown): DragValues => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        x.set(0);
        y.set(0);
    }, [resetKey, x, y]);

    return { x, y };
};
