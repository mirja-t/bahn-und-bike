import { expect, it, describe } from "vitest";
import { SvgMapBuilder } from "./svgMap";

describe("SvgMapBuilder", () => {
    // to do: fix for western and southern hemispheres
    const worldBounds = {
        north: 90,
        south: -90,
        east: 180,
        west: -180,
    };
    it("getSize: should calculate width and height of the map based on bounds and scale", () => {
        const scale = 10;
        const sizeWorld = SvgMapBuilder.getSize(worldBounds, scale);
        const sizeNorthEast = SvgMapBuilder.getSize(
            {
                north: 20,
                south: 0,
                east: 60,
                west: 40,
            },
            scale,
        );
        expect(sizeWorld.width).toBeCloseTo(3600);
        expect(sizeWorld.height).toBeCloseTo(1800);
        expect(sizeNorthEast.width).toBeCloseTo(200);
        expect(sizeNorthEast.height).toBeCloseTo(203.086);
    });
    it("getMapPosition: should convert lat and lon to x and y", () => {
        const londonCoordinates = [51.5, 0];
        const northPole = [90, 0];
        // const equatorDayBreak = [-180, 0];
        // const southPole = [-90, 0];
        const [londonX] = SvgMapBuilder.getMapPosition(
            londonCoordinates[1],
            londonCoordinates[0],
            worldBounds,
            10,
        );
        const [northPoleX] = SvgMapBuilder.getMapPosition(
            northPole[1],
            northPole[0],
            worldBounds,
            10,
        );
        // const [equatorDayBreakX, equatorDayBreakY] =
        //     SvgMapBuilder.getMapPosition(
        //         equatorDayBreak[1],
        //         equatorDayBreak[0],
        //         worldBounds,
        //         10,
        //     );
        // const [southPoleX] = SvgMapBuilder.getMapPosition(
        //     southPole[1],
        //     southPole[0],
        //     worldBounds,
        //     10,
        // );
        expect(northPoleX).toBeCloseTo(1800);
        expect(londonX).toBeCloseTo(1800);
        // expect(londonY).toBeCloseTo(0);
        // expect(equatorDayBreakX).toBeCloseTo(0);
        // expect(northPoleY).toBeCloseTo(0);
        // expect(equatorDayBreakY).toBeCloseTo(500);
    });
});
