import { Loading } from "../loading/Loading";
import styles from "./itemlist.module.scss";
import { motion } from "framer-motion";

type Item<T> = {
    id: string;
    name: string;
} & {
    [K in keyof T]: T[K];
};
interface ItemListProps<T> {
    items: Item<T>[];
    icon?: React.ReactNode;
    activeId?: string;
    fn?: (item: Item<T>) => void;
    loading?: boolean;
}

export const ItemList = <T,>({
    items,
    activeId,
    icon,
    fn,
    loading = false,
}: ItemListProps<T>) => {
    return (
        <ul className={styles.itemlist}>
            {loading && <Loading />}
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
                    onClick={() => fn && fn(item)}
                    className={
                        activeId && item.id === activeId ? styles.active : ""
                    }
                >
                    {icon && icon}
                    <h4>{`${item.name}`}</h4>
                </motion.li>
            ))}
        </ul>
    );
};
