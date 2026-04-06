import styles from "./closeButton.module.scss";
import { motion } from "framer-motion";

export const CloseButton = ({
    onClick,
    open,
}: {
    onClick: () => void;
    open: boolean;
}) => {
    return (
        <button
            className={`${styles.closeButton} ${open ? styles.open : ""}`}
            onClick={onClick}
        >
            <motion.svg viewBox="0 0 24 24" width="100%" height="100%">
                <motion.line
                    animate={{
                        x1: open ? [8, 14, 20] : [20, 14, 8],
                        x2: open ? [8, 6, 4] : [4, 6, 8],
                        y1: open ? [2, 3, 4] : [4, 3, 2],
                        y2: open ? [22, 21, 20] : [20, 21, 22],
                    }}
                    transition={{ duration: 0.3 }}
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="20"
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
                <motion.line
                    animate={{
                        y1: open ? [2, 7, 12] : [12, 7, 2],
                        y2: open ? [22, 17, 12] : [12, 17, 22],
                    }}
                    transition={{ duration: 0.3 }}
                    x1="12"
                    y1="2"
                    x2="12"
                    y2="20"
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
                <motion.line
                    animate={{
                        x2: open ? [16, 18, 20] : [20, 18, 16],
                        x1: open ? [16, 10, 4] : [4, 10, 16],
                        y1: open ? [2, 3, 4] : [4, 3, 2],
                        y2: open ? [22, 21, 20] : [20, 21, 22],
                    }}
                    transition={{ duration: 0.3 }}
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="20"
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
            </motion.svg>
        </button>
    );
};
