import styles from "./box.module.scss";
interface BoxProps {
    children: React.ReactNode;
}
export const Box = ({ children }: BoxProps) => {
    return <div className={styles.box}>{children}</div>;
};
