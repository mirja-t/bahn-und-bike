import "./home.scss";
import { useTranslation } from "../../utils/i18n";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";
import { Germany } from "../map/germany/Germany";

export const Home = () => {
    const { t } = useTranslation();

    return (
        <div id="home" className="container">
            <div className="wrapper">
                <h1>{t("home_headline")}</h1>
                <h3>{t("home_subheadline")}</h3>
                <p className="margintop">{t("home_p1")}</p>
                <ol>
                    <li>{t("home_l1")}</li>
                    <li>{t("home_l2")}</li>
                    <li>{t("home_l3")}</li>
                    <li>{t("home_l4")}</li>
                </ol>
                <p className="start">
                    <Link to="/routefinder" title={t("start")}>
                        <Button label={t("start")} />
                    </Link>
                </p>
            </div>
            <div id="germany">
                <Germany />
            </div>
        </div>
    );
};
