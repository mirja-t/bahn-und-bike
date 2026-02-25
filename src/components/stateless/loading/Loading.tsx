import "./loading.scss";
import { useTranslation } from "../../../utils/i18n";

// to do: add animation, maybe use framer-motion for fade in/out and a simple loading animation

export const Loading = () => {
    const { t } = useTranslation();

    return (
        <div id="loader">
            <p>{t("loading") || "loading..."}</p>
        </div>
    );
};
