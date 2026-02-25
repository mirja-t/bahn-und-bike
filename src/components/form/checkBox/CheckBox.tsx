import { motion } from "framer-motion";
import "./checkbox.scss";
import { useTranslation } from "../../../utils/i18n";

interface CheckBoxProps {
    value: boolean;
    handleCheckboxChange: () => void;
}
export const CheckBox = ({ value, handleCheckboxChange }: CheckBoxProps) => {
    const { t } = useTranslation();
    const unchecked = "11.3,15 15,15 18.7,15 ";
    const checked = "9.3,15 13.3,19 21.8,9.8 ";

    return (
        <fieldset className="directconnection">
            <label htmlFor="directconnection">{t("direct_trains_only")}</label>
            <div className={value ? "active inputCheckbox" : "inputCheckbox"}>
                <motion.svg
                    className={value ? "active check" : "check"}
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 30 30"
                >
                    <motion.polyline
                        fill="none"
                        strokeWidth="3"
                        stroke="red"
                        points={unchecked}
                        initial={{ points: unchecked }}
                        animate={{ points: value ? checked : unchecked }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.svg>
                <input
                    id="directconnection"
                    name="directconnection"
                    type="checkbox"
                    checked={value}
                    onChange={handleCheckboxChange}
                />
            </div>
        </fieldset>
    );
};
