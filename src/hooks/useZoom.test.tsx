import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useZoom } from "./useZoom";

// Use fixed SVG dimensions matching the actual svgMap values
const SVG_WIDTH = 917.4986;
const SVG_HEIGHT = 1241.720936767978;

vi.mock("../utils/svgMap", () => ({
    svgWidth: 917.4986,
    svgHeight: 1241.720936767978,
}));

type JourneyStub = { lastStation: { x: number; y: number } };

const makeJourney = (x: number, y: number): JourneyStub => ({
    lastStation: { x, y },
});

// Cast stubs to the hook's parameter type; stubs only need lastStation.x/y
const asJourneys = (stubs: JourneyStub[]): Parameters<typeof useZoom>[0] =>
    stubs as unknown as Parameters<typeof useZoom>[0];

describe("useZoom", () => {
    it("returns default zoom when value is 0", () => {
        const journeys = asJourneys([makeJourney(100, 200)]);
        const { result } = renderHook(() => useZoom(journeys, 0, false));
        expect(result.current).toEqual({ x: 0, y: 0, scale: 1, ratio: 1 });
    });

    it("returns default zoom when loading is true", () => {
        const journeys = asJourneys([makeJourney(100, 200)]);
        const { result } = renderHook(() => useZoom(journeys, 1, true));
        expect(result.current).toEqual({ x: 0, y: 0, scale: 1, ratio: 1 });
    });

    it("returns default zoom when journeys is empty (prevents Infinity/NaN)", () => {
        const journeys = asJourneys([]);
        const { result } = renderHook(() => useZoom(journeys, 1, false));
        expect(result.current).toEqual({ x: 0, y: 0, scale: 1, ratio: 1 });
    });

    it("returns finite scale and ratio for a single journey (distX/distY = 0)", () => {
        const journeys = asJourneys([makeJourney(200, 300)]);
        const { result } = renderHook(() => useZoom(journeys, 1, false));
        expect(Number.isFinite(result.current.scale)).toBe(true);
        expect(Number.isFinite(result.current.ratio)).toBe(true);
        expect(result.current.scale).toBeGreaterThan(0);
        // ratio defaults to 1 when distY is 0
        expect(result.current.ratio).toBe(1);
    });

    it("computes correct zoom for multiple journeys", () => {
        // Two journeys at x=100,y=200 and x=300,y=600
        const journeys = asJourneys([makeJourney(100, 200), makeJourney(300, 600)]);
        const { result } = renderHook(() => useZoom(journeys, 1, false));

        const distX = 300 - 100; // 200
        const distY = 600 - 200; // 400
        const expectedScaleX = SVG_WIDTH / distX;
        const expectedScaleY = SVG_HEIGHT / distY;
        const expectedScale = Math.min(expectedScaleX, expectedScaleY);
        const expectedRatio = distX / distY; // 200/400 = 0.5
        const expectedOffsetX = 0.5 - (100 + distX / 2) / SVG_WIDTH;
        const expectedOffsetY = 0.5 - (200 + distY / 2) / SVG_HEIGHT;

        expect(result.current.scale).toBeCloseTo(expectedScale, 5);
        expect(result.current.ratio).toBeCloseTo(expectedRatio, 5);
        expect(result.current.x).toBeCloseTo(expectedOffsetX, 5);
        expect(result.current.y).toBeCloseTo(expectedOffsetY, 5);
    });

    it("resets to default zoom when value changes back to 0", () => {
        const journeys = asJourneys([makeJourney(100, 200), makeJourney(300, 600)]);
        const { result, rerender } = renderHook(
            ({ value }) => useZoom(journeys, value, false),
            { initialProps: { value: 1 } },
        );

        expect(result.current.scale).not.toBe(1);

        rerender({ value: 0 });

        expect(result.current).toEqual({ x: 0, y: 0, scale: 1, ratio: 1 });
    });
});
