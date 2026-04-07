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
                    initial={{ x1: 6, y1: 0, x2: 6, y2: 24 }}
                    animate={{
                        x1: open ? 20 : 6,
                        x2: open ? 4 : 6,
                        y1: open ? 4 : 0,
                        y2: open ? 20 : 24,
                    }}
                    transition={{ duration: 0.3 }}
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
                <motion.line
                    initial={{ y1: 0, y2: 24 }}
                    animate={{
                        y1: open ? 12 : 0,
                        y2: open ? 12 : 24,
                    }}
                    x1={12}
                    x2={12}
                    transition={{ duration: 0.3 }}
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
                <motion.line
                    initial={{ x1: 18, y1: 0, x2: 18, y2: 24 }}
                    animate={{
                        x2: open ? 20 : 18,
                        x1: open ? 4 : 18,
                        y1: open ? 4 : 0,
                        y2: open ? 20 : 24,
                    }}
                    transition={{ duration: 0.3 }}
                    strokeLinecap="round"
                    stroke="#555"
                    strokeWidth={2}
                />
            </motion.svg>
        </button>
    );
};
