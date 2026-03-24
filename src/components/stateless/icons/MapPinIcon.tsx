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
                    y: 0,
                }}
                animate={{
                    opacity: active ? 1 : 0,
                    scale: active ? 1.5 : 1,
                    y: active ? -2 : 0,
                }}
                d={`M${x + 4.45},${y - 8}c0,-2.7,-2.2,-4.9,-4.9,-4.9s-4.9,2.2,-4.9,4.9s.6,2.6,1.4,3.5c.9.9,3.5,3.4,3.5,3.4,0,0,2.6-2.6,3.5-3.4.9-.9,1.4-2.1,1.4-3.5Z`}
            />
            <motion.circle
                strokeWidth={0.8 / userScale}
                cx={x - 0.5}
                cy={y - 10.5}
                r={5.4 / userScale}
                fill="var(--bg)"
                initial={{
                    opacity: 0,
                    scale: 1,
                }}
                animate={{
                    opacity: active ? 1 : 0,
                    scale: active ? 1 : 0,
                }}
            />
            <motion.text
                x={x}
                y={y - 7}
                textAnchor="middle"
                fontSize={8 / userScale}
                fill={`var(--text)`}
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
