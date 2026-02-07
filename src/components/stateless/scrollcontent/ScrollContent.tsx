import "./scrollcontent.scss";
import React, { useState, useEffect } from "react";
import spacer from "../../../assets/images/spacer-16-9.gif";
import { useGesture } from "@use-gesture/react";

const clamp = (min: number, max: number, val: number) =>
    Math.min(Math.max(min, val), max);

interface ScrollContentProps {
    children: React.ReactNode;
    parentEl: HTMLElement | null;
    transitionComplete: boolean;
    id: string;
}

export const ScrollContent = ({
    children,
    parentEl,
    transitionComplete,
    id,
}: ScrollContentProps) => {
    const [wrapperRef, setWrapperRef] = useState<HTMLElement | null>(null);
    const [elRef, setElRef] = useState<HTMLElement | null>(null);
    const [classes, setClasses] = useState("scrollcontent");
    const [height, setHeight] = useState<number | null>(null);
    const [scrollbarHeight, setScrollbarHeight] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [clipRef, setClipRef] = useState<HTMLElement | null>(null);
    const [clipHeight, setClipHeight] = useState(0);
    const [touchScrollPos, setTouchScrollPos] = useState(0);

    // init parent height
    useEffect(() => {
        if (!transitionComplete || !parentEl) return;
        setHeight(parentEl.offsetHeight);
    }, [parentEl, parentEl?.offsetHeight, transitionComplete]);

    // init scrollbar
    useEffect(() => {
        if (!elRef || !height) return;
        const overflow = elRef.offsetHeight > height + 2;
        setClasses(overflow ? `scrollcontent scroll` : `scrollcontent`);
        setScrollbarHeight((height / elRef?.offsetHeight) * height);
    }, [children, elRef, height]);

    // resize
    useEffect(() => {
        if (!elRef || !height) return;
        const overflow = elRef.offsetHeight > height + 2;
        const handleResize = () => {
            setClasses(overflow ? `scrollcontent scroll` : `scrollcontent`);
            setScrollbarHeight((height / elRef?.offsetHeight) * height);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [children, height, elRef]);

    // init clip ref
    useEffect(() => {
        const resetClipHeight = () => {
            if (!clipRef || !transitionComplete) return;
            const cHeight = clipRef.offsetHeight - 44;
            setClipHeight(cHeight);
        };
        resetClipHeight();
        window.addEventListener("resize", resetClipHeight);
        return () => {
            window.removeEventListener("resize", resetClipHeight);
        };
    }, [transitionComplete, clipRef]);

    useEffect(() => {
        setTouchScrollPos(0);
        setScrollOffset(0);
    }, [scrollbarHeight]);

    const bind = useGesture({
        onWheel: ({ memo, movement: [_, dy] }) => {
            if (!memo)
                memo = {
                    pos: touchScrollPos,
                };
            const offset =
                (wrapperRef?.getBoundingClientRect().top || 0) -
                (elRef?.getBoundingClientRect().top || 0);
            const scrollbarDist = scrollbarHeight / (height || 1);
            setScrollOffset(offset * scrollbarDist);
            const elOverflow = (elRef?.offsetHeight || 0) - (height || 0);
            const newPos = memo.pos - dy;
            const newScrollPos = clamp(-elOverflow, 0, newPos);
            setTouchScrollPos(newScrollPos);

            return memo;
        },
        onDrag: ({ memo, movement: [_, dy] }) => {
            if (!memo)
                memo = {
                    pos: touchScrollPos,
                };
            const offset =
                (wrapperRef?.getBoundingClientRect().top || 0) -
                (elRef?.getBoundingClientRect().top || 0);
            const scrollbarDist = scrollbarHeight / (height || 1);
            setScrollOffset(offset * scrollbarDist);
            const elOverflow = (elRef?.offsetHeight || 0) - (height || 0);
            const newPos = memo.pos + dy;
            const newScrollPos = clamp(-elOverflow, 0, newPos);
            setTouchScrollPos(newScrollPos);

            return memo;
        },
    });

    return (
        <div
            id={id}
            className="scrollcontent-wrapper"
            ref={setWrapperRef}
            style={{
                height: height ? `${height}px` : "auto",
            }}
        >
            {(elRef?.offsetHeight || 0) > (height || 0) + 2 && (
                <div
                    className="scrollbar"
                    style={{
                        height: `${scrollbarHeight}px`,
                        transform: `translateY(${scrollOffset}px)`,
                    }}
                />
            )}
            <div
                className={classes}
                style={{
                    height: height ? `${height}px` : "auto",
                    clipPath:
                        id === "clip" ? `inset(${clipHeight}px 0 0 0)` : "",
                }}
            >
                <div
                    {...bind()}
                    ref={setElRef}
                    style={{
                        transform: `translateY(${touchScrollPos}px)`,
                    }}
                >
                    {id === "clip" && (
                        <div ref={setClipRef} className="spacer">
                            <img src={spacer} alt="" />
                        </div>
                    )}
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};
