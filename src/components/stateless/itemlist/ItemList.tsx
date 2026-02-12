import styles from "./itemlist.module.scss";
import { useSelector } from "react-redux";
import { type LangCode, selectLang } from "../../../AppSlice";
import { motion } from "framer-motion";

type Item<T> = {
    id: string;
    name: string;
} & {
    [K in keyof T]?: T[K];
};
interface ItemListProps<T> {
    items: Item<T>[];
    icon?: React.ReactNode;
    lang: LangCode;
    activeItem: Item<T> | null;
    fn: (item: Item<T>) => void;
}

export const ItemList = <T,>({
    items,
    lang,
    activeItem,
    icon,
    fn,
}: ItemListProps<T>) => {
    const labels = useSelector(selectLang);
    return (
        <ul className={styles.itemlist}>
            {items.length < 1 && (
                <li
                    className={`${styles.route} ${styles.nomatch}`}
                >{`${labels[lang].nomatch}`}</li>
            )}
            {items.map((item, idx) => (
                <motion.li
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.1 * idx,
                        duration: 1,
                    }}
                    key={item.id}
                    onClick={() => fn(item)}
                    className={
                        activeItem && item.id === activeItem?.id
                            ? styles.active
                            : ""
                    }
                >
                    {icon && icon}
                    <h4>{`${item.name}`}</h4>
                </motion.li>
            ))}
        </ul>
    );
};
