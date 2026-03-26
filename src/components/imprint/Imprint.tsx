import styles from "../privacy/legalpages.module.scss";
import { useTranslation } from "../../utils/i18n";
import { Link } from "react-router-dom";
import ScrollContainer from "../stateless/scrollcontainer/ScrollContainer";
import LayoutWithSidebar from "../../layout/LayoutWithSidebar";

interface ImprintProps {
    resetState: () => void;
}
export const Imprint = ({ resetState }: ImprintProps) => {
    const { t } = useTranslation();

    return (
        <LayoutWithSidebar>
            <LayoutWithSidebar.Main>
                <ScrollContainer>
                    <ScrollContainer.ScrollContent>
                        <div className={styles.wrapper}>
                            <div>
                                <h1>{t("imprint")}</h1>
                                <h5>{t("siteowner")}</h5>
                                <p>Mirja Tschakarov</p>
                                <p>Friedrichsberger Straße 5</p>
                                <p>10243 Berlin</p>
                                <h5>{t("contact")}</h5>
                                <p>
                                    <span>{t("email")}</span>{" "}
                                    mirja.t@bahn-und-bike.eu
                                </p>
                                <p className="margintop">
                                    <Link
                                        className="button button-primary"
                                        to="/"
                                        title={t("backtostart")}
                                        onClick={resetState}
                                    >
                                        <span>{t("backtostart")}</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </ScrollContainer.ScrollContent>
                </ScrollContainer>
            </LayoutWithSidebar.Main>
        </LayoutWithSidebar>
    );
};
