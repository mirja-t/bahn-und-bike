import styles from "./instructions.module.scss";
import { useTranslation } from "../../utils/i18n";
import { Panel } from "../stateless/panel/Panel";
import ScrollContainer from "../stateless/scrollcontainer/ScrollContainer";
import { CloseButton } from "../stateless/button/CloseButton";
import { useState } from "react";

export const Instructions = () => {
    const { t } = useTranslation();
    const [showInstructions, setShowInstructions] = useState(true);
    const handleClick = () => {
        setShowInstructions(false);
    };
    return (
        showInstructions && (
            <div className={styles.instructionsWrapper}>
                <Panel direction="column" variant="frostedGlass">
                    <CloseButton onClick={handleClick} open={true} />
                    <ScrollContainer height="min(550px, 50vh)">
                        <ScrollContainer.ScrollContent>
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
                        </ScrollContainer.ScrollContent>
                    </ScrollContainer>
                </Panel>
            </div>
        )
    );
};
