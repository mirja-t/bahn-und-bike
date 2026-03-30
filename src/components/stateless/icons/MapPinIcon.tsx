import { motion } from "framer-motion";

interface MapPinIconProps {
    idx: number;
    active: boolean;
    position: {
        x: number;
        y: number;
    };
    scale: number;
}
export const MapPinIcon = ({
    idx,
    active,
    position: { x, y },
    scale,
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
                    scale: active ? 2 / scale : 1 / scale,
                }}
                d={`M${x + 4.8},${y - 20 / scale}c0,-2.7,-2.2,-4.9,-4.9,-4.9s-4.9,2.2,-4.9,4.9s.6,2.6,1.4,3.5c.9.9,3.5,3.4,3.5,3.4,0,0,2.6-2.6,3.5-3.4.9-.9,1.4-2.1,1.4-3.5Z`}
            />
            <motion.text
                x={x}
                y={y - 13 / scale}
                textAnchor="middle"
                fontSize={10 / scale}
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
