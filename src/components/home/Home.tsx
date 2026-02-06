import "./home.scss";
import { useSelector } from "react-redux";
import { LangCode, selectLang } from "../../AppSlice";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";
import { Germany } from "../map/germany/Germany";

interface HomeProps {
    lang: LangCode;
}
export const Home = ({ lang }: HomeProps) => {
    const labels = useSelector(selectLang);

    return (
        <div id="home" className="container">
            <div className="wrapper">
                <h1>{labels[lang].home_headline}</h1>
                <h3>{labels[lang].home_subheadline}</h3>
                <p className="margintop">{labels[lang].home_p1}</p>
                <ol>
                    <li>{labels[lang].home_l1}</li>
                    <li>{labels[lang].home_l2}</li>
                    <li>{labels[lang].home_l3}</li>
                    <li>{labels[lang].home_l4}</li>
                </ol>
                <p className="start">
                    <Link to="/routefinder" title={labels[lang].start}>
                        <Button label={labels[lang].start} />
                    </Link>
                </p>
            </div>
            <div id="germany">
                <Germany />
            </div>
        </div>
    );
};
