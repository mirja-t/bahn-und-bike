import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePinch } from "./usePinch";
import { useRef } from "react";

// Helper: create a fake element with spy addEventListener/removeEventListener
const createFakeElement = () => {
    const listeners: Map<string, EventListener> = new Map();
    return {
        addEventListener: vi.fn((type: string, listener: EventListener) => {
            listeners.set(type, listener);
        }),
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
const renderWithRef = (fakeEl: FakeElement) => {
    return renderHook(() => {
        const ref = useRef<HTMLElement | null>(
            fakeEl as unknown as HTMLElement,
        );
        return usePinch(ref);
    });
};

describe("usePinch", () => {
    let fakeEl: FakeElement;

    beforeEach(() => {
        fakeEl = createFakeElement();
    });

    it("registers wheel event listener on mount", () => {
        renderWithRef(fakeEl);
        expect(fakeEl.addEventListener).toHaveBeenCalledWith(
            "wheel",
            expect.any(Function),
            { passive: false },
        );
    });

    it("removes event listeners on unmount", () => {
        const { unmount } = renderWithRef(fakeEl);
        unmount();
        expect(fakeEl.removeEventListener).toHaveBeenCalledWith(
            "wheel",
            expect.any(Function),
        );
    });

    it("updates hook state on wheel event with ctrlKey", () => {
        const { result } = renderWithRef(fakeEl);

        const wheelEvent = {
            ctrlKey: true,
            deltaX: 12,
            deltaY: -8,
            offsetX: 101,
            offsetY: 66,
            preventDefault: vi.fn(),
        } as unknown as WheelEvent;

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        expect(wheelEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(result.current).toEqual({
            deltaX: 12,
            deltaY: -8,
            offsetX: 101,
            offsetY: 66,
        });
    });

    it("does NOT update state on wheel event without ctrlKey", () => {
        const { result } = renderWithRef(fakeEl);

        const wheelEvent = {
            ctrlKey: false,
            deltaX: 20,
            deltaY: 50,
            offsetX: 30,
            offsetY: 40,
            preventDefault: vi.fn(),
        } as unknown as WheelEvent;

        act(() => {
            fakeEl._dispatch("wheel", wheelEvent);
        });

        expect(wheelEvent.preventDefault).not.toHaveBeenCalled();
        expect(result.current).toEqual({
            deltaX: 0,
            deltaY: 0,
            offsetX: 0,
            offsetY: 0,
        });
    });
});
