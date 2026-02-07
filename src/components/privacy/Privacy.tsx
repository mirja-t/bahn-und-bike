import "./privacy.scss";
import { selectLang } from "../../AppSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";

interface PrivacyProps {
    lang: string;
    resetState: () => void;
}

export const Privacy = ({ lang, resetState }: PrivacyProps) => {
    const labels = useSelector(selectLang);

    return (
        <div id="privacy" className="container">
            <div className="wrapper">
                <h1>{labels[lang].privacy}</h1>

                <p>{labels[lang].release}: 5.2.2022</p>

                <h5 id="m3">{labels[lang].responsible}</h5>
                <p>
                    Mirja Tschakarov
                    <br />
                    Friedrichsberger Straße 5<br />
                    10243 Berlin
                </p>
                <h5>{labels[lang].privacy_overview}</h5>
                <p>{labels[lang].privacy_p1}</p>
                <h6>{labels[lang].privacy_webhosting}</h6>
                <p>{labels[lang].privacy_p2}</p>
                <ul className="m-elements">
                    <li>{labels[lang].privacy_l1}</li>
                    <li>{labels[lang].privacy_l2}</li>
                    <li>{labels[lang].privacy_l3}</li>
                    <li>{labels[lang].privacy_l4}</li>
                </ul>
                <h6>{labels[lang].privacy_p3}</h6>
                <ul className="m-elements">
                    <li>{labels[lang].privacy_l5}</li>
                    <li>{labels[lang].privacy_l6}</li>
                    <li>{labels[lang].privacy_l7}</li>
                    <li>
                        IONOS by 1&1: {labels[lang].privacy_l8}{" "}
                        <a
                            href="https://www.ionos.de"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://www.ionos.de
                        </a>
                        ; {labels[lang].privacy}:{" "}
                        <a
                            href="https://www.ionos.de/terms-gtc/terms-privacy"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://www.ionos.de/terms-gtc/terms-privacy
                        </a>
                        ; {labels[lang].privacy_l9}{" "}
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
                    <Link
                        to="/"
                        title={labels[lang].backtostart}
                        onClick={resetState}
                    >
                        <Button label={labels[lang].backtostart} />
                    </Link>
                </p>
            </div>
        </div>
    );
};
