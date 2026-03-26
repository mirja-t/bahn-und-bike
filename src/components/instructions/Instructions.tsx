import styles from "./instructions.module.scss";
import { useTranslation } from "../../utils/i18n";
import { Panel } from "../stateless/panel/Panel";
import {
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "../map/trainroutes/TrainroutesSlice";
import { useSelector } from "react-redux";

export const Instructions = () => {
    const { t } = useTranslation();
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    return !journeys.length && !isLoading ? (
        <div className={styles.instructionsWrapper}>
            <Panel direction="column" variant="frostedGlass">
                <div className={styles.instructions}>
                    <h1>{t("home_headline")}</h1>
                    <h3>{t("home_subheadline")}</h3>
                    <p>{t("home_p1")}</p>
                    <ol>
                        <li>{t("home_l1")}</li>
                        <li>{t("home_l2")}</li>
                        <li>{t("home_l3")}</li>
                        <li>{t("home_l4")}</li>
                    </ol>
                </div>
            </Panel>
        </div>
    ) : null;
};
