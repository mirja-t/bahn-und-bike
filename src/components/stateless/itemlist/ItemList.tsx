import styles from "./itemlist.module.scss";
import { Loading } from "../loading/Loading";
import { motion } from "framer-motion";

type Item<T> = {
    id: string | number;
    name: string;
} & {
    [K in keyof T]: T[K];
};
interface ItemListProps<T> {
    items: Item<T>[];
    icon?: React.ReactNode;
    activeId?: string;
    onClick?: (item: Item<T>) => void;
    loading?: boolean;
    onHover?: (item: Item<T> | null) => void;
    variant?: "default" | "orderedList";
}

export const ItemList = <T,>({
    items,
    activeId,
    icon,
    onClick,
    loading = false,
    onHover,
    variant = "default",
}: ItemListProps<T>) => {
    const listItem = (item: Item<T>, idx: number) => (
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
            tabIndex={onClick ? 0 : undefined}
            role={onClick ? "button" : undefined}
            onClick={onClick ? () => onClick(item) : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick(item);
                          }
                      }
                    : undefined
            }
            onMouseEnter={() => onHover && onHover(item)}
            onMouseLeave={() => onHover && onHover(null)}
            onFocus={() => onHover && onHover(item)}
            onBlur={() => onHover && onHover(null)}
            className={[
                activeId && item.id === activeId ? styles.active : "",
                onClick ? styles.interactive : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {icon && icon}
            <p className={styles.label}>{`${item.name}`}</p>
        </motion.li>
    );
    return (
        <>
            {loading && <Loading />}
            {variant === "orderedList" ? (
                <ol className={`${styles.itemlist} ${styles[variant]}`}>
                    {items.map((item, idx) => listItem(item, idx))}
                </ol>
            ) : (
                <ul className={`${styles.itemlist} ${styles[variant]}`}>
                    {items.map((item, idx) => listItem(item, idx))}
                </ul>
            )}
        </>
    );
};
