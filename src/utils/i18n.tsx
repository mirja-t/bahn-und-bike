import { useSelector } from "react-redux";
import { LangCode, selectLangCode } from "../AppSlice";
import enLabels from "../i18n/en.json";
import deLabels from "../i18n/de.json";

const translations = {
    en: enLabels,
    de: deLabels,
};

export const useTranslation = () => {
    const currentLang = useSelector(selectLangCode);

    const t = (key: string): string => {
        const langData = translations[currentLang];
        return langData[key as keyof typeof langData] || key;
    };

    return { t };
};

// For use outside of components (if needed)
export const getTranslation = (langCode: LangCode, key: string): string => {
    const langData = translations[langCode];
    return langData[key as keyof typeof langData] || key;
};
