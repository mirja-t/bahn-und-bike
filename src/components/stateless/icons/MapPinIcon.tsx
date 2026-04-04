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
                    scale: 0,
                }}
                animate={{
                    opacity: active ? 1 : 0,
                    scale: active ? 1.35 : 0,
                }}
                d={`
                    M${x} ${y - 8 / scale}
                    c${-5 / scale} ${-5 / scale}, ${-10 / scale} ${-7.5 / scale}, ${-10 / scale} ${-15 / scale} 
                    c0 ${-5 / scale}, ${2.5 / scale} ${-10 / scale}, ${10 / scale} ${-10 / scale}
                    c${7.5 / scale} 0, ${10 / scale} ${5 / scale}, ${10 / scale} ${10 / scale}
                    c0 ${7.5 / scale}, ${-5 / scale} ${10 / scale}, ${-10 / scale} ${15 / scale}
                    z
                    `}
            />
            <motion.text
                x={x}
                y={y - 18 / scale}
                textAnchor="middle"
                fontSize={16 / scale}
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
