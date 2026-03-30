import { describe, it, expect } from "vitest";
import { haversineDistance } from "./haversineDistance";

describe("haversineDistance", () => {
    it("should return 0 for the same point", () => {
        expect(haversineDistance(52.52, 13.405, 52.52, 13.405)).toBe(0);
    });

    it("should return approximately 504 km between Berlin and Munich", () => {
        // Berlin: 52.5200° N, 13.4050° E
        // Munich: 48.1351° N, 11.5820° E
        const distance = haversineDistance(52.52, 13.405, 48.1351, 11.582);
        expect(distance).toBeGreaterThan(500);
        expect(distance).toBeLessThan(510);
    });

    it("should return approximately 878 km between Berlin and Paris", () => {
        // Berlin: 52.5200° N, 13.4050° E
        // Paris: 48.8566° N, 2.3522° E
        const distance = haversineDistance(52.52, 13.405, 48.8566, 2.3522);
        expect(distance).toBeGreaterThan(870);
        expect(distance).toBeLessThan(890);
    });

    it("should return the same distance regardless of direction", () => {
        const d1 = haversineDistance(52.52, 13.405, 48.1351, 11.582);
        const d2 = haversineDistance(48.1351, 11.582, 52.52, 13.405);
        expect(d1).toBeCloseTo(d2, 5);
    });

    it("should return a positive distance for different points", () => {
        const distance = haversineDistance(0, 0, 0, 1);
        expect(distance).toBeGreaterThan(0);
    });
});
