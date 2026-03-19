import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePinch } from "./usePinch";
import { useRef } from "react";

// Helper: create a fake element with spy addEventListener/removeEventListener
const createFakeElement = () => {
    const listeners: Map<string, EventListener> = new Map();
    return {
        addEventListener: vi.fn(
            (type: string, listener: EventListener) => {
                listeners.set(type, listener);
            },
        ),
        removeEventListener: vi.fn(),
        _listeners: listeners,
        _dispatch(type: string, event: Event) {
            const listener = listeners.get(type);
            if (listener) listener(event);
        },
    };
};

type FakeElement = ReturnType<typeof createFakeElement>;

// Renders the hook with a ref whose .current is already set to fakeEl.
const renderWithRef = (
    fakeEl: FakeElement,
    initialScale = 1,
    setScale: (n: number) => void = vi.fn(),
) => {
    return renderHook(
        ({ scale, setter }: { scale: number; setter: (n: number) => void }) => {
            const ref = useRef<HTMLElement | null>(
                fakeEl as unknown as HTMLElement,
            );
            usePinch(ref, scale, setter);
        },
        { initialProps: { scale: initialScale, setter: setScale } },
    );
};

describe("usePinch", () => {
    let fakeEl: FakeElement;
    let setScale: (n: number) => void;

    beforeEach(() => {
        fakeEl = createFakeElement();
        setScale = vi.fn();
    });

    it("registers touch and wheel event listeners on mount", () => {
        renderWithRef(fakeEl, 1, setScale);
        expect(fakeEl.addEventListener).toHaveBeenCalledWith(
            "touchstart",
            expect.any(Function),
            { passive: true },
        );
        expect(fakeEl.addEventListener).toHaveBeenCalledWith(
            "touchmove",
            expect.any(Function),
            { passive: true },
        );
        expect(fakeEl.addEventListener).toHaveBeenCalledWith(
            "touchend",
            expect.any(Function),
            { passive: true },
        );
        expect(fakeEl.addEventListener).toHaveBeenCalledWith(
            "wheel",
            expect.any(Function),
            { passive: false },
        );
    });

    it("removes event listeners on unmount", () => {
        const { unmount } = renderWithRef(fakeEl, 1, setScale);
        unmount();
        expect(fakeEl.removeEventListener).toHaveBeenCalledWith(
            "touchstart",
            expect.any(Function),
        );
        expect(fakeEl.removeEventListener).toHaveBeenCalledWith(
            "touchmove",
            expect.any(Function),
        );
        expect(fakeEl.removeEventListener).toHaveBeenCalledWith(
            "touchend",
            expect.any(Function),
        );
        expect(fakeEl.removeEventListener).toHaveBeenCalledWith(
            "wheel",
            expect.any(Function),
        );
    });

    it("updates scale on wheel event with ctrlKey", () => {
        renderWithRef(fakeEl, 1, setScale);

        const wheelEvent = new WheelEvent("wheel", {
            ctrlKey: true,
            deltaY: 1, // scroll down → zoom out
            bubbles: true,
            cancelable: true,
        });

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        // scale was 1, step is -0.2 → new scale = 0.8
        expect(setScale).toHaveBeenCalledWith(0.8);
    });

    it("increases scale on wheel up with ctrlKey", () => {
        renderWithRef(fakeEl, 1, setScale);

        const wheelEvent = new WheelEvent("wheel", {
            ctrlKey: true,
            deltaY: -1, // scroll up → zoom in
            bubbles: true,
            cancelable: true,
        });

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        // scale was 1, step is +0.2 → new scale = 1.2
        expect(setScale).toHaveBeenCalledWith(1.2);
    });

    it("does NOT update scale on wheel event without ctrlKey", () => {
        renderWithRef(fakeEl, 1, setScale);

        const wheelEvent = new WheelEvent("wheel", {
            ctrlKey: false,
            deltaY: 50,
            bubbles: true,
        });

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        expect(setScale).not.toHaveBeenCalled();
    });

    it("clamps scale to a minimum of 0.1 on wheel zoom-out", () => {
        renderWithRef(fakeEl, 0.1, setScale);

        const wheelEvent = new WheelEvent("wheel", {
            ctrlKey: true,
            deltaY: 100,
            bubbles: true,
            cancelable: true,
        });

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        expect(setScale).toHaveBeenCalledWith(0.1);
    });
});
