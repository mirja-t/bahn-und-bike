import { selectLang } from "../../AppSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../stateless/button/Button";

interface ImprintProps {
    lang: string;
    resetState: () => void;
}
export const Imprint = ({ lang, resetState }: ImprintProps) => {
    const labels = useSelector(selectLang);

    return (
        <div className="container">
            <div className="wrapper">
                <h1>{labels[lang].imprint}</h1>
                <h5>{labels[lang].siteowner}</h5>
                <p>Mirja Tschakarov</p>
                <p>Friedrichsberger Straße 5</p>
                <p>10243 Berlin</p>
                <h5>{labels[lang].contact}</h5>
                <p>
                    <span>{labels[lang].email}</span> mirja.t@bahn-und-bike.eu
                </p>
                <p>
                    <span>{labels[lang].phone}</span> 017667594878
                </p>
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
    );
};
