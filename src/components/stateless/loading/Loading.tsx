import "./loading.scss";
import { useSelector } from "react-redux";
import { selectCurrentLang, selectLang } from "../../../AppSlice";

// to do: add animation, maybe use framer-motion for fade in/out and a simple loading animation

export const Loading = () => {
    const labels = useSelector(selectLang);
    const lang = useSelector(selectCurrentLang);

    return (
        <div id="loader">
            <p>{labels[lang]?.loading || "loading..."}</p>
        </div>
    );
};
