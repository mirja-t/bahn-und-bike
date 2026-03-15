import styles from "./loading.module.scss";
import { useTranslation } from "../../../utils/i18n";
import { Spinner } from "../spinner/Spinner";
import { motion } from "framer-motion";

// to do: add animation, maybe use framer-motion for fade in/out and a simple loading animation

export const Loading = () => {
    const { t } = useTranslation();
    return (
        <motion.div
            className={styles.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Spinner />
            <p>{t("loading") || "loading..."}</p>
        </motion.div>
    );
};
