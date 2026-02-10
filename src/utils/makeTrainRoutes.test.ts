import { expect, it, describe } from "vitest";
import { makeTrainRoutes } from "./makeTrainRoutes";
import { SvgMapBuilder } from "./svgMap";

const bounds = {
    north: 55.755826,
    south: 48.8589384,
    east: 37.6173,
    west: 2.2644619,
};
const parisCoordinates = [48.8589384, 2.2644619];
const berlinCoordinates = [52.525605, 13.369075];
const bruxellesCoordinates = [50.836389, 4.336389];
const warsawCoordinates = [52.2296756, 21.0122287];
const moscowCoordinates = [55.755826, 37.6173];
const rathenowCoordinates = [52.59972, 12.354915];
const wustermarkCoordinates = [52.551501, 12.938232];
const teltowCoordinates = [52.388633, 13.299917];
const jueterbogCoordinates = [51.997564, 13.054871];
const [parisCoordinatesX, parisCoordinatesY] = SvgMapBuilder.getMapPosition(
    parisCoordinates[1],
    parisCoordinates[0],
    bounds,
);
const [berlinCoordinatesX, berlinCoordinatesY] = SvgMapBuilder.getMapPosition(
    berlinCoordinates[1],
    berlinCoordinates[0],
    bounds,
);
const [bruxellesCoordinatesX, bruxellesCoordinatesY] =
    SvgMapBuilder.getMapPosition(
        bruxellesCoordinates[1],
        bruxellesCoordinates[0],
        bounds,
    );
const [warsawCoordinatesX, warsawCoordinatesY] = SvgMapBuilder.getMapPosition(
    warsawCoordinates[1],
    warsawCoordinates[0],
    bounds,
);
const [rathenowCoordinatesX, rathenowCoordinatesY] =
    SvgMapBuilder.getMapPosition(
        rathenowCoordinates[1],
        rathenowCoordinates[0],
        bounds,
    );
const [wustermarkCoordinatesX, wustermarkCoordinatesY] =
    SvgMapBuilder.getMapPosition(
        wustermarkCoordinates[1],
        wustermarkCoordinates[0],
        bounds,
    );
const [teltowCoordinatesX, teltowCoordinatesY] = SvgMapBuilder.getMapPosition(
    teltowCoordinates[1],
    teltowCoordinates[0],
    bounds,
);
const [jueterbogCoordinatesX, jueterbogCoordinatesY] =
    SvgMapBuilder.getMapPosition(
        jueterbogCoordinates[1],
        jueterbogCoordinates[0],
        bounds,
    );
const mockedResponse = [
    {
        destination_id: "paris",
        trainline_id: "TGV",
        dur: 0,
        stop_number: 0,
        destination_name: "Paris, Gare du Nord",
        name: "TGV",
        lat: parisCoordinates[0].toString(),
        lon: parisCoordinates[1].toString(),
    },
    {
        destination_id: "bruxelles",
        trainline_id: "TGV",
        dur: 30,
        stop_number: 1,
        destination_name: "Bruxelles, Midi",
        name: "TGV",
        lat: bruxellesCoordinates[0].toString(),
        lon: bruxellesCoordinates[1].toString(),
    },
    {
        destination_id: "berlin",
        trainline_id: "TGV",
        dur: 300,
        stop_number: 2,
        destination_name: "S+U Berlin Hauptbahnhof",
        name: "TGV",
        lat: berlinCoordinates[0].toString(),
        lon: berlinCoordinates[1].toString(),
    },
    {
        destination_id: "warsaw",
        trainline_id: "TGV",
        dur: 300,
        stop_number: 3,
        destination_name: "Warszawa Centralna",
        name: "TGV",
        lat: warsawCoordinates[0].toString(),
        lon: warsawCoordinates[1].toString(),
    },
    {
        destination_id: "moscow",
        trainline_id: "TGV",
        dur: 600,
        stop_number: 4,
        destination_name: "Moscow, Leningradsky",
        name: "TGV",
        lat: moscowCoordinates[0].toString(),
        lon: moscowCoordinates[1].toString(),
    },
    {
        destination_id: "rathenow",
        trainline_id: "RE4",
        dur: 0,
        stop_number: 0,
        destination_name: "Rathenow, Bahnhof",
        name: "RE4",
        lat: rathenowCoordinates[0].toString(),
        lon: rathenowCoordinates[1].toString(),
    },
    {
        destination_id: "wustermark",
        trainline_id: "RE4",
        dur: 1,
        stop_number: 1,
        destination_name: "Wustermark, Bahnhof",
        name: "RE4",
        lat: wustermarkCoordinates[0].toString(),
        lon: wustermarkCoordinates[1].toString(),
    },
    {
        destination_id: "berlin",
        trainline_id: "RE4",
        dur: 20,
        stop_number: 2,
        destination_name: "S+U Berlin Hauptbahnhof",
        name: "RE4",
        lat: berlinCoordinates[0].toString(),
        lon: berlinCoordinates[1].toString(),
    },
    {
        destination_id: "teltow",
        trainline_id: "RE4",
        dur: 20,
        stop_number: 3,
        destination_name: "Teltow, Bahnhof",
        name: "RE4",
        lat: teltowCoordinates[0].toString(),
        lon: teltowCoordinates[1].toString(),
    },
    {
        destination_id: "jueterbog",
        trainline_id: "RE4",
        dur: 4,
        stop_number: 4,
        destination_name: "Jüterbog, Bahnhof",
        name: "RE4",
        lat: jueterbogCoordinates[0].toString(),
        lon: jueterbogCoordinates[1].toString(),
    },
];
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
        const equatorDayBreak = [-180, 0];
        const southPole = [-90, 0];
        const [londonX, londonY] = SvgMapBuilder.getMapPosition(
            londonCoordinates[1],
            londonCoordinates[0],
            worldBounds,
            10,
        );
        const [northPoleX, northPoleY] = SvgMapBuilder.getMapPosition(
            northPole[1],
            northPole[0],
            worldBounds,
            10,
        );
        const [equatorDayBreakX, equatorDayBreakY] =
            SvgMapBuilder.getMapPosition(
                equatorDayBreak[1],
                equatorDayBreak[0],
                worldBounds,
                10,
            );
        const [southPoleX] = SvgMapBuilder.getMapPosition(
            southPole[1],
            southPole[0],
            worldBounds,
            10,
        );
        expect(northPoleX).toBeCloseTo(1800);
        expect(londonX).toBeCloseTo(1800);
        // expect(londonY).toBeCloseTo(0);
        // expect(equatorDayBreakX).toBeCloseTo(0);
        // expect(northPoleY).toBeCloseTo(0);
        // expect(equatorDayBreakY).toBeCloseTo(500);
    });
});
describe("makeTrainRoutes", () => {
    it("should generate train routes with direct connections only", () => {
        // Arrange
        const start = "8011160";
        const value = 20;

        // Act
        const result = makeTrainRoutes(mockedResponse, start, value * 30);

        // Assert
        expect(result).toEqual([
            {
                connection: null,
                dur: 330,
                line: "TGV",
                firstStation: {
                    stop_name: "S+U Berlin Hauptbahnhof",
                    stop_id: "berlin",
                    x: berlinCoordinatesX,
                    y: berlinCoordinatesY,
                },
                lastStation: {
                    stop_name: "Paris, Gare du Nord",
                    stop_id: "paris",
                    x: parisCoordinatesX,
                    y: parisCoordinatesY,
                },
                stopIds: ["berlin", "bruxelles", "paris"],
                points: `${berlinCoordinatesX},${berlinCoordinatesY} ${bruxellesCoordinatesX},${bruxellesCoordinatesY} ${parisCoordinatesX},${parisCoordinatesY} `,
            },
            {
                connection: null,
                dur: 300,
                line: "TGV",
                firstStation: {
                    stop_name: "S+U Berlin Hauptbahnhof",
                    stop_id: "berlin",
                    x: berlinCoordinatesX,
                    y: berlinCoordinatesY,
                },
                lastStation: {
                    stop_name: "Warszawa Centralna",
                    stop_id: "warsaw",
                    x: warsawCoordinatesX,
                    y: warsawCoordinatesY,
                },
                stopIds: ["berlin", "warsaw"],
                points: `${berlinCoordinatesX},${berlinCoordinatesY} ${warsawCoordinatesX},${warsawCoordinatesY} `,
            },
            {
                connection: null,
                dur: 300,
                line: "RE4",
                firstStation: {
                    stop_name: "S+U Berlin Hauptbahnhof",
                    stop_id: "berlin",
                    x: berlinCoordinatesX,
                    y: berlinCoordinatesY,
                },
                lastStation: {
                    stop_name: "Rathenow, Bahnhof",
                    stop_id: "rathenow",
                    x: rathenowCoordinatesX,
                    y: rathenowCoordinatesY,
                },
                stopIds: ["berlin", "wustermark", "rathenow"],
                points: `${berlinCoordinatesX},${berlinCoordinatesY} ${wustermarkCoordinatesX},${wustermarkCoordinatesY} ${rathenowCoordinatesX},${rathenowCoordinatesY} `,
            },
            {
                connection: null,
                dur: 300,
                line: "RE4",
                firstStation: {
                    stop_name: "S+U Berlin Hauptbahnhof",
                    stop_id: "berlin",
                    x: berlinCoordinatesX,
                    y: berlinCoordinatesY,
                },
                lastStation: {
                    stop_name: "Jüterbog, Bahnhof",
                    stop_id: "jueterbog",
                    x: jueterbogCoordinatesX,
                    y: jueterbogCoordinatesY,
                },
                stopIds: ["berlin", "teltow", "jueterbog"],
                points: `${berlinCoordinatesX},${berlinCoordinatesY} ${teltowCoordinatesX},${teltowCoordinatesY} ${jueterbogCoordinatesX},${jueterbogCoordinatesY} `,
            },
        ]);
    });
});
