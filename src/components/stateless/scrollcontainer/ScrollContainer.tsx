import styles from "./ScrollContainer.module.scss";
import { forwardRef, useRef } from "react";

interface ChildProps {
    element: keyof HTMLElementTagNameMap;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}
const Child = forwardRef<HTMLElement, ChildProps>(
    ({ element, children, style, className }: ChildProps, ref) => {
        const Component = element as React.ElementType;
        return (
            <Component className={className} ref={ref} style={style}>
                {children}
            </Component>
        );
    },
);

const FitContent = ({
    children,
    element = "div",
    style,
    className,
}: ScrollComponentProps) => {
    return (
        <Child element={element} style={style} className={className}>
            {children}
        </Child>
    );
};

type ScrollComponentProps = {
    children: React.ReactNode;
    element?: keyof HTMLElementTagNameMap;
    style?: Record<string, string>;
    height?: string;
    className?: string;
};
const ScrollContent = ({
    children,
    element = "div",
    style,
    className,
}: ScrollComponentProps) => {
    const scrollContainerRef = useRef<HTMLElement>(null);

    return (
        <Child
            className={
                className
                    ? `${styles.scrollContent} ${className}`
                    : styles.scrollContent
            }
            element={element}
            ref={scrollContainerRef}
            style={style}
        >
            {children}
        </Child>
    );
};

function ScrollContainer({
    children,
    element = "div",
    height = "100%",
    style,
    className,
}: ScrollComponentProps) {
    return (
        <Child
            element={element}
            style={{
                height,
                ...style,
            }}
            className={
                className
                    ? `${styles.scrollContainer} ${className}`
                    : styles.scrollContainer
            }
        >
            {children}
        </Child>
    );
}

export default Object.assign(ScrollContainer, { FitContent, ScrollContent });
