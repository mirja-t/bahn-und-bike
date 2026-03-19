import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDrag } from "./useDrag";

describe("useDrag", () => {
    it("returns x and y MotionValues initialised to 0", () => {
        const { result } = renderHook(() => useDrag("key1"));

        expect(result.current.x.get()).toBe(0);
        expect(result.current.y.get()).toBe(0);
    });

    it("resets x and y to 0 when resetKey changes", async () => {
        const { result, rerender } = renderHook(
            ({ resetKey }) => useDrag(resetKey),
            { initialProps: { resetKey: "key1" } },
        );

        act(() => {
            result.current.x.set(100);
            result.current.y.set(200);
        });

        expect(result.current.x.get()).toBe(100);
        expect(result.current.y.get()).toBe(200);

        rerender({ resetKey: "key2" });

        expect(result.current.x.get()).toBe(0);
        expect(result.current.y.get()).toBe(0);
    });

    it("does not reset x and y when resetKey stays the same", () => {
        const { result, rerender } = renderHook(
            ({ resetKey }) => useDrag(resetKey),
            { initialProps: { resetKey: "key1" } },
        );

        act(() => {
            result.current.x.set(50);
            result.current.y.set(75);
        });

        rerender({ resetKey: "key1" });

        expect(result.current.x.get()).toBe(50);
        expect(result.current.y.get()).toBe(75);
    });
});
