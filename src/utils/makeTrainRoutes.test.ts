import { expect, it, describe } from "vitest";
import { makeTrainRoutes } from "./makeTrainRoutes";
import type { ResponseStop } from "../components/map/trainroutes/TrainroutesSlice";

const parisCoordinates = [48.8589384, 2.2644619];
const berlinCoordinates = [52.525605, 13.369075];
const bruxellesCoordinates = [50.836389, 4.336389];
const warsawCoordinates = [52.2296756, 21.0122287];
const moscowCoordinates = [55.755826, 37.6173];

const parisStop: ResponseStop = {
    destination_id: "paris",
    trainline_id: "TGV",
    dur: 0,
    stop_number: 0,
    destination_name: "Paris, Gare du Nord",
    name: "SNCF",
    lat: parisCoordinates[0].toString(),
    lon: parisCoordinates[1].toString(),
};
const bruxellesStop: ResponseStop = {
    destination_id: "bruxelles",
    trainline_id: "TGV",
    dur: 30,
    stop_number: 1,
    destination_name: "Bruxelles, Midi",
    name: "SNCF",
    lat: bruxellesCoordinates[0].toString(),
    lon: bruxellesCoordinates[1].toString(),
};
const berlinStop: ResponseStop = {
    destination_id: "berlin",
    trainline_id: "TGV",
    dur: 300,
    stop_number: 2,
    destination_name: "S+U Berlin Hauptbahnhof",
    name: "SNCF",
    lat: berlinCoordinates[0].toString(),
    lon: berlinCoordinates[1].toString(),
};
const berlinStop2: ResponseStop = {
    destination_id: "berlin",
    trainline_id: "DB",
    dur: 0,
    stop_number: 0,
    destination_name: "S+U Berlin Hauptbahnhof",
    name: "Deutsche Bahn",
    lat: berlinCoordinates[0].toString(),
    lon: berlinCoordinates[1].toString(),
};
const warsawStop: ResponseStop = {
    destination_id: "warsaw",
    trainline_id: "TGV",
    dur: 300,
    stop_number: 3,
    destination_name: "Warszawa Centralna",
    name: "SNCF",
    lat: warsawCoordinates[0].toString(),
    lon: warsawCoordinates[1].toString(),
};
const moscowStop: ResponseStop = {
    destination_id: "moscow",
    trainline_id: "TGV",
    dur: 600,
    stop_number: 4,
    destination_name: "Moscow, Leningradsky",
    name: "SNCF",
    lat: moscowCoordinates[0].toString(),
    lon: moscowCoordinates[1].toString(),
};
const vilniiusStop: ResponseStop = {
    destination_id: "vilnius",
    trainline_id: "PR",
    dur: 0,
    stop_number: 0,
    destination_name: "Vilnius, Central Station",
    name: "Polish Railways",
    lat: "54.687157",
    lon: "25.279652",
};
const warsawStop2: ResponseStop = {
    destination_id: "warsaw",
    trainline_id: "PR",
    dur: 500,
    stop_number: 1,
    destination_name: "Warszawa Centralna",
    name: "Polish Railways",
    lat: warsawCoordinates[0].toString(),
    lon: warsawCoordinates[1].toString(),
};
const warsawStop3: ResponseStop = {
    destination_id: "warsaw",
    trainline_id: "DB",
    dur: 500,
    stop_number: 1,
    destination_name: "Warszawa Centralna",
    name: "Deutsche Bahn",
    lat: warsawCoordinates[0].toString(),
    lon: warsawCoordinates[1].toString(),
};
const bratislavaStop: ResponseStop = {
    destination_id: "bratislava",
    trainline_id: "PR",
    dur: 200,
    stop_number: 2,
    destination_name: "Bratislava, Hlavná stanica",
    name: "Polish Railways",
    lat: "48.148598",
    lon: "17.107748",
};
const viennaStop: ResponseStop = {
    destination_id: "vienna",
    trainline_id: "PR",
    dur: 300,
    stop_number: 3,
    destination_name: "Vienna, Hauptbahnhof",
    name: "Polish Railways",
    lat: "48.185867",
    lon: "16.373064",
};
const mockedAPIResponse: ResponseStop[] = [
    parisStop,
    bruxellesStop,
    berlinStop,
    warsawStop,
    moscowStop,
];
const mockedAPIResponseWithConnections: ResponseStop[] = [
    ...mockedAPIResponse,
    vilniiusStop,
    warsawStop2,
    bratislavaStop,
    viennaStop,
    berlinStop2,
    warsawStop3,
];

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

        // Assert - Check that routes contain expected destinations
        // (order is not guaranteed as it depends on implementation details)
        expect(result).toHaveLength(2);

        const warsawRoute = result.find(
            (r) => r.lastStation.stop_id === "warsaw",
        );
        expect(warsawRoute).toBeDefined();

        const parisRoute = result.find(
            (r) => r.lastStation.stop_id === "paris",
        );
        expect(parisRoute).toBeDefined();
    });
    it("should generate train routes with connecting routes", () => {
        // Arrange
        const start = "berlin";
        const durationLimit = 6000;

        // Act
        const result = makeTrainRoutes(
            mockedAPIResponseWithConnections,
            start,
            durationLimit,
            false,
        );

        // Assert - Check that routes contain expected destinations
        // (order is not guaranteed as it depends on implementation details)
        expect(result).toHaveLength(4);
        const vilniusRoute = result.find(
            (r) => r.lastStation.stop_id === "vilnius",
        );
        expect(vilniusRoute).toBeDefined();
        expect(vilniusRoute?.trainlines).toEqual([
            { trainline_id: "TGV", trainline_name: "SNCF" },
            { trainline_id: "DB", trainline_name: "Deutsche Bahn" },
        ]);
        expect(vilniusRoute?.connection).toEqual({
            stop_name: "Warszawa Centralna",
            initial_trains: [
                { trainline_id: "TGV", trainline_name: "SNCF" },
                { trainline_id: "DB", trainline_name: "Deutsche Bahn" },
            ],
            connecting_trains: [
                { trainline_id: "PR", trainline_name: "Polish Railways" },
            ],
        });
    });
});
