import "./activeVelorouteSectionIcon.scss";
import { motion, AnimatePresence } from "framer-motion";

interface ActiveVelorouteSectionIconProps {
    strokeScale: number;
    section: any[];
}

export const ActiveVelorouteSectionIcon = ({
    strokeScale,
    section,
}: ActiveVelorouteSectionIconProps) => {
    if (!section) return <g />;

    const items = [section[0], section[section.length - 1]];

    return (
        <AnimatePresence>
            {items.map(
                (item, i) =>
                    item && (
                        <motion.g
                            key={`veloroute-icon-${i}`}
                            initial={{
                                opacity: 0,
                                scale: 0,
                                x: item.x,
                                y: item.y,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 0.45 / strokeScale,
                                x: item.x - 7 / strokeScale,
                                y: item.y - 20 / strokeScale,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0,
                                x: item.x,
                                y: item.y,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                        >
                            <path
                                className="veloroute-pin-outer"
                                d="M27.64,12.64C27.64,5.66,21.98,0,15,0S2.36,5.66,2.36,12.64c0,5.75,3.84,10.6,9.1,12.13L15,30l3.54-5.23
                C23.8,23.24,27.64,18.39,27.64,12.64z"
                            />
                            <circle
                                className="veloroute-pin-inner"
                                cx="15"
                                cy="12.64"
                                r="9.52"
                            />
                            <text className="veloroute-pin-text" x={12} y={17}>
                                {i + 1}
                            </text>
                        </motion.g>
                    ),
            )}
        </AnimatePresence>
    );
};
