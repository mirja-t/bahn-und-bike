import styles from "./spinner.module.scss";
import { motion, useTime, useTransform } from "framer-motion";

export const Spinner = () => {
    const centerX = 197.1;
    const centerY = 131.1;
    const crankRadius = 30.4;
    const pedalHalfWidth = 10.8;
    const rotationDurationMs = 1000;

    const time = useTime();
    const angle = useTransform(
        time,
        (currentTime) =>
            -((currentTime % rotationDurationMs) / rotationDurationMs) *
            Math.PI *
            2,
    );

    const topX = useTransform(
        angle,
        (a) => centerX + crankRadius * Math.sin(a),
    );
    const topY = useTransform(
        angle,
        (a) => centerY - crankRadius * Math.cos(a),
    );
    const bottomX = useTransform(
        angle,
        (a) => centerX - crankRadius * Math.sin(a),
    );
    const bottomY = useTransform(
        angle,
        (a) => centerY + crankRadius * Math.cos(a),
    );

    const topPedalX1 = useTransform(topX, (x) => x - pedalHalfWidth);
    const topPedalX2 = useTransform(topX, (x) => x + pedalHalfWidth);
    const bottomPedalX1 = useTransform(bottomX, (x) => x - pedalHalfWidth);
    const bottomPedalX2 = useTransform(bottomX, (x) => x + pedalHalfWidth);

    return (
        <div className={styles.spinner}>
            <svg
                id="Ebene_1"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 371.5 209.8"
            >
                <path
                    fill="black"
                    d="M295.7,58.2c-13.8,0-26.7,3.7-37.9,10.2l-15.4-23.4L263.4,0h-34.9c-2.1,0-3.9,1.7-3.9,3.9s1.7,3.9,3.9,3.9h22.7l-15.7,33.7h-120.3l13-33.6h-44.5c-.9,0-8.5-.3-13.6,4.6-2.8,2.7-4.3,6.4-4.3,10.8,0,17.1,15.1,17.1,28.5,17.1v-7.8c-18.1,0-20.7-2-20.7-9.4s.6-4,1.9-5.2c2.3-2.2,6.5-2.6,8.1-2.5h33.4l-17.5,45.4c-7.4-2.4-15.3-3.8-23.6-3.8C34,57.2,0,91.2,0,133s34,75.8,75.8,75.8,75.8-34,75.8-75.8-18.5-57.4-45-69.2l5.9-15.4,82.9,88.5h24.6c1.5,40.5,34.9,72.9,75.7,72.9s75.8-34,75.8-75.8-34-75.8-75.8-75.8ZM143.6,133c0,37.4-30.4,67.8-67.8,67.8S8,170.3,8,133s30.4-67.8,67.8-67.8,14.2,1.1,20.7,3.2l-24.3,63.1,7.3,2.8,24.3-63.1c23.5,10.7,39.8,34.3,39.8,61.7ZM123.9,49.2h107.9l-35.9,76.9L123.9,49.2ZM238.5,53.3l12.8,19.4c-17.7,12.9-29.7,33.2-31.2,56.4h-16.9l35.3-75.8ZM255.7,79.3l32.8,49.7h-60.4c1.5-20.4,12-38.3,27.6-49.7ZM295.7,201.8c-36.4,0-66.2-28.9-67.7-64.9h74.9l-40.7-61.7c9.9-5.6,21.3-8.9,33.5-8.9,37.4,0,67.8,30.4,67.8,67.8s-30.4,67.8-67.8,67.8Z"
                />
                <motion.line
                    className="axis"
                    stroke="black"
                    strokeWidth="8"
                    x1={bottomX}
                    y1={bottomY}
                    x2={topX}
                    y2={topY}
                />
                <motion.line
                    className="pedal1"
                    stroke="black"
                    strokeWidth="8"
                    x1={topPedalX1}
                    y1={topY}
                    x2={topPedalX2}
                    y2={topY}
                />
                <motion.line
                    className="pedal2"
                    stroke="black"
                    strokeWidth="8"
                    x1={bottomPedalX1}
                    y1={bottomY}
                    x2={bottomPedalX2}
                    y2={bottomY}
                />
            </svg>
        </div>
    );
};
