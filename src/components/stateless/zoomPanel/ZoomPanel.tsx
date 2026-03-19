import styles from "./zoompanel.module.scss";
import { Panel } from "../panel/Panel";

interface ZoomPanelProps {
    fn: (arg0: "+" | "-") => void;
}

export const ZoomPanel = ({ fn }: ZoomPanelProps) => {
    return (
        <div className={styles.zoompanel}>
            <Panel direction="column">
                <button
                    onClick={() => {
                        fn("+");
                    }}
                >
                    +
                </button>
                <button
                    onClick={() => {
                        fn("-");
                    }}
                >
                    -
                </button>
            </Panel>
        </div>
    );
};
