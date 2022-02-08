import './privacy.scss';
import { selectLang } from '../../AppSlice';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

export const Privacy = ({lang, resetState}) => {

    const labels = useSelector(selectLang);

    return (<div id="privacy" className="container">
            <div className="wrapper">
            <h1>{labels.privacy[lang]}</h1>

            <p>{labels.release[lang]}: 5.2.2022</p>

            <h5 id="m3">{labels.responsible[lang]}</h5>
            <p>Mirja Tschakarov<br/>Friedrichsberger Straße 5<br/>10243 Berlin</p>
            <h5>{labels.privacy_overview[lang]}</h5>
            <p>{labels.privacy_p1[lang]}</p>
            <h6>{labels.privacy_webhosting[lang]}</h6>
            <p>{labels.privacy_p2[lang]}</p>
            <ul className="m-elements">
                <li>{labels.privacy_l1[lang]}</li>
                <li>{labels.privacy_l2[lang]}</li>
                <li>{labels.privacy_l3[lang]}</li>
                <li>{labels.privacy_l4[lang]}</li>
            </ul>
            <h6>{labels.privacy_p3[lang]}</h6>
            <ul className="m-elements">
                <li>{labels.privacy_l5[lang]}</li>
                <li>{labels.privacy_l6[lang]}</li>
                <li>{labels.privacy_l7[lang]}</li>
                <li>IONOS by 1&1: {labels.privacy_l8[lang]} <a href="https://www.ionos.de" target="_blank" rel="noreferrer">https://www.ionos.de</a>; {labels.privacy[lang]}: <a href="https://www.ionos.de/terms-gtc/terms-privacy" target="_blank" rel="noreferrer">https://www.ionos.de/terms-gtc/terms-privacy</a>; {labels.privacy_l9[lang]} <a href="https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/auftragsverarbeitung/?utm_source=search&utm_medium=global&utm_term=Auft&utm_campaign=HELP_CENTER&utm_content=/hilfe/" target="_blank" rel="noreferrer">https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/auftragsverarbeitung/?utm_source=search&utm_medium=global&utm_term=Auft&utm_campaign=HELP_CENTER&utm_content=/hilfe/</a>.
                </li>
            </ul>
            <div className="seal"><a href="https://datenschutz-generator.de/" title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." target="_blank" rel="noreferrer"><img src="https://datenschutz-generator.de/wp-content/plugins/ts-dsg/images/dsg-seal/dsg-seal-pp-de.png" alt="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." width="250" height="250"/></a></div>
            <p className="margintop">
                <Link 
                    className="button" 
                    to="/" 
                    title={labels.backtostart[lang]}
                    onClick={resetState}>
                        {labels.backtostart[lang]}
                </Link>
            </p>
        </div>
    </div>)
}