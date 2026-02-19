import "./loading.scss";
import { useSelector } from "react-redux";
import { LangCode, selectLang } from "../../../AppSlice";

// to do: add animation, maybe use framer-motion for fade in/out and a simple loading animation

interface LoadingProps {
    lang: LangCode;
}

export const Loading = ({ lang }: LoadingProps) => {
    const labels = useSelector(selectLang);

    return (
        <div id="loader">
            <p>{labels[lang].loading}</p>
        </div>
    );
};
