import styles from "./checkbox.module.scss";
import { motion } from "framer-motion";
import { useTranslation } from "../../../utils/i18n";

interface CheckBoxProps {
    checked: boolean;
    handleCheckboxChange: () => void;
    id: string;
}
export const CheckBox = ({
    checked,
    handleCheckboxChange,
    id,
}: CheckBoxProps) => {
    const { t } = useTranslation();
    const unchecked = "11.3,15 15,15 18.7,15 ";
    const checkedPoints = "9.3,15 13.3,19 21.8,9.8 ";

    return (
        <fieldset className={styles.checkboxWrapper}>
            <label htmlFor={id}>{t("direct_trains_only")}</label>
            <div
                className={
                    checked
                        ? `${styles.checked} ${styles.inputCheckbox}`
                        : styles.inputCheckbox
                }
            >
                <motion.svg
                    className={
                        checked
                            ? `${styles.checked} ${styles.check}`
                            : styles.check
                    }
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 30 30"
                >
                    <motion.polyline
                        fill="none"
                        strokeWidth="3"
                        points={unchecked}
                        initial={{ points: unchecked }}
                        animate={{
                            points: checked ? checkedPoints : unchecked,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.svg>
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    checked={checked}
                    onChange={handleCheckboxChange}
                />
            </div>
        </fieldset>
    );
};
