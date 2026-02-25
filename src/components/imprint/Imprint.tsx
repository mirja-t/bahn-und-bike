import { useTranslation } from "../../utils/i18n";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";

interface ImprintProps {
    resetState: () => void;
}
export const Imprint = ({ resetState }: ImprintProps) => {
    const { t } = useTranslation();

    return (
        <div className="container">
            <div className="wrapper">
                <h1>{t("imprint")}</h1>
                <h5>{t("siteowner")}</h5>
                <p>Mirja Tschakarov</p>
                <p>Friedrichsberger Straße 5</p>
                <p>10243 Berlin</p>
                <h5>{t("contact")}</h5>
                <p>
                    <span>{t("email")}</span> mirja.t@bahn-und-bike.eu
                </p>
                <p>
                    <span>{t("phone")}</span> 017667594878
                </p>
            </div>
            <p className="margintop">
                <Link to="/" title={t("backtostart")} onClick={resetState}>
                    <Button label={t("backtostart")} />
                </Link>
            </p>
        </div>
    );
};
