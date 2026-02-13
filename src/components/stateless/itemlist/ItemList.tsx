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
    activeItem: Item<T> | null;
    fn: (item: Item<T>) => void;
}

export const ItemList = <T,>({
    items,
    activeItem,
    icon,
    fn,
}: ItemListProps<T>) => {
    return (
        <ul className={styles.itemlist}>
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
