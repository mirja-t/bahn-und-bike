import { motion } from "framer-motion";

interface MapPinIconProps {
    idx: number;
    active: boolean;
    position: {
        x: number;
        y: number;
    };
    userScale: number;
}
export const MapPinIcon = ({
    idx,
    active,
    position: { x, y },
    userScale,
}: MapPinIconProps) => {
    return (
        <svg>
            <motion.path
                initial={{
                    opacity: 0,
                    scale: 1,
                }}
                animate={{
                    opacity: active ? 1 : 0,
                    scale: active ? 1.25 / userScale : 1 / userScale,
                }}
                d={`M${x + 4.45},${y - 8 / userScale}c0,-2.7,-2.2,-4.9,-4.9,-4.9s-4.9,2.2,-4.9,4.9s.6,2.6,1.4,3.5c.9.9,3.5,3.4,3.5,3.4,0,0,2.6-2.6,3.5-3.4.9-.9,1.4-2.1,1.4-3.5Z`}
            />
            <motion.text
                x={x - 1 / userScale}
                y={y - 5 / userScale}
                textAnchor="middle"
                fontSize={7 / userScale}
                fill={`var(--bg)`}
                style={{ pointerEvents: "none" }}
                fontFamily="Oswald, sans-serif"
                fontWeight={600}
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: active ? 1 : 0,
                }}
            >
                {idx}
            </motion.text>
        </svg>
    );
};
