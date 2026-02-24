import "./privacy.scss";
import { useTranslation } from "../../utils/i18n";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";

interface PrivacyProps {
    resetState: () => void;
}

export const Privacy = ({ resetState }: PrivacyProps) => {
    const { t } = useTranslation();

    return (
        <div id="privacy" className="container">
            <div className="wrapper">
                <h1>{t("privacy")}</h1>

                <p>{t("release")}: 5.2.2022</p>

                <h5 id="m3">{t("responsible")}</h5>
                <p>
                    Mirja Tschakarov
                    <br />
                    Friedrichsberger Straße 5<br />
                    10243 Berlin
                </p>
                <h5>{t("privacy_overview")}</h5>
                <p>{t("privacy_p1")}</p>
                <h6>{t("privacy_webhosting")}</h6>
                <p>{t("privacy_p2")}</p>
                <ul className="m-elements">
                    <li>{t("privacy_l1")}</li>
                    <li>{t("privacy_l2")}</li>
                    <li>{t("privacy_l3")}</li>
                    <li>{t("privacy_l4")}</li>
                </ul>
                <h6>{t("privacy_p3")}</h6>
                <ul className="m-elements">
                    <li>{t("privacy_l5")}</li>
                    <li>{t("privacy_l6")}</li>
                    <li>{t("privacy_l7")}</li>
                    <li>
                        IONOS by 1&1: {t("privacy_l8")}{" "}
                        <a
                            href="https://www.ionos.de"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://www.ionos.de
                        </a>
                        ; {t("privacy")}:{" "}
                        <a
                            href="https://www.ionos.de/terms-gtc/terms-privacy"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://www.ionos.de/terms-gtc/terms-privacy
                        </a>
                        ; {t("privacy_l9")}{" "}
                        <a
                            href="https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/auftragsverarbeitung/?utm_source=search&utm_medium=global&utm_term=Auft&utm_campaign=HELP_CENTER&utm_content=/hilfe/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/auftragsverarbeitung/?utm_source=search&utm_medium=global&utm_term=Auft&utm_campaign=HELP_CENTER&utm_content=/hilfe/
                        </a>
                        .
                    </li>
                </ul>
                <div className="seal">
                    <a
                        href="https://datenschutz-generator.de/"
                        title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            src="https://datenschutz-generator.de/wp-content/plugins/ts-dsg/images/dsg-seal/dsg-seal-pp-de.png"
                            alt="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
                            width="250"
                            height="250"
                        />
                    </a>
                </div>
                <p className="margintop">
                    <Link to="/" title={t("backtostart")} onClick={resetState}>
                        <Button label={t("backtostart")} />
                    </Link>
                </p>
            </div>
        </div>
    );
};
