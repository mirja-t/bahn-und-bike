import "./itemlist.scss";
import { VelorouteIcon } from "../icons/VelorouteIcon";
import { useSelector } from "react-redux";
import { selectLang } from "../../../AppSlice";
import { motion } from "framer-motion";

interface ItemListProps {
    items: any[];
    lang: string;
    activeItem: any;
    fn: (item: any) => void;
}

export const ItemList = ({ items, lang, activeItem, fn }: ItemListProps) => {
    const labels = useSelector(selectLang);

    return (
        <ul className="destinationslist">
            {items.length < 1 && (
                <li className="route nomatch">{`${labels[lang].nomatch}`}</li>
            )}
            {items.map((item, idx) => (
                <motion.li
                    initial={{
                        x: 500,
                        opacity: 0,
                    }}
                    animate={{
                        x: 0,
                        opacity: 1,
                    }}
                    transition={{
                        delay: 250 * idx,
                    }}
                    key={item.id}
                    onClick={() => fn(item)}
                    className={
                        activeItem && item.id === activeItem?.id ? "active" : ""
                    }
                >
                    <VelorouteIcon />
                    <h4 className="veloroute">{`${item.name}`}</h4>
                </motion.li>
            ))}
        </ul>
    );
};
