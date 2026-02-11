import { expect, it, describe } from "vitest";
import { makeTrainRoutes } from "./makeTrainRoutes";
// import { SvgMapBuilder } from "./svgMap";
import type {
    // CurrentTrainroute,
    ResponseStop,
} from "../components/map/trainroutes/TrainroutesSlice";

// const bounds = {
//     north: 55.755826,
//     south: 48.8589384,
//     east: 37.6173,
//     west: 2.2644619,
// };
const parisCoordinates = [48.8589384, 2.2644619];
const berlinCoordinates = [52.525605, 13.369075];
const bruxellesCoordinates = [50.836389, 4.336389];
const warsawCoordinates = [52.2296756, 21.0122287];
const moscowCoordinates = [55.755826, 37.6173];
// const rathenowCoordinates = [52.59972, 12.354915];
// const wustermarkCoordinates = [52.551501, 12.938232];
// const teltowCoordinates = [52.388633, 13.299917];
// const jueterbogCoordinates = [51.997564, 13.054871];
/*
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
    );*/

const mockedAPIResponse: ResponseStop[] = [
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
    /*
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
    },*/
];
/*
const connectionBerlinWarschau: CurrentTrainroute = {
    connection: null,
    dur: 300,
    trainlines: ["TGV"],
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
    pathLength: 2,
    stopIds: ["berlin", "warsaw"],
    points: `${berlinCoordinatesX},${berlinCoordinatesY} ${warsawCoordinatesX},${warsawCoordinatesY} `,
};
const connectionBerlinParis: CurrentTrainroute = {
    connection: null,
    dur: 330,
    trainlines: ["TGV"],
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
    pathLength: 2,
    stopIds: ["berlin", "bruxelles", "paris"],
    points: `${berlinCoordinatesX},${berlinCoordinatesY} ${bruxellesCoordinatesX},${bruxellesCoordinatesY} ${parisCoordinatesX},${parisCoordinatesY} `,
};
const connectionBerlinRathenow: CurrentTrainroute = {
    connection: null,
    dur: 300,
    trainlines: ["RE4"],
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
    pathLength: 2,
};
const connectionBerlinJueterbog: CurrentTrainroute = {
    connection: null,
    dur: 300,
    trainlines: ["RE4"],
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
    pathLength: 2,
};*/

describe("makeTrainRoutes", () => {
    it("should generate train routes with direct connections only", () => {
        // Arrange
        const start = "berlin";
        const durationLimit = 600;

        // Act
        const result = makeTrainRoutes(
            mockedAPIResponse,
            start,
            durationLimit,
            true,
        );

        // Assert
        expect(result[0].lastStation.stop_id).toBe("warsaw");
    });
});
