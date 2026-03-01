import { expect, it, describe } from "vitest";
import { makeTrainRoutes } from "./makeTrainRoutes";
import type { ResponseStop } from "../components/map/trainroutes/TrainroutesSlice";
import { mockStops } from "./_testData";

const {
    parisStopSNCF,
    bruxellesStopSNCF,
    berlinStopSNCF,
    warsawStopSNCF,
    moscowStopSNCF,
    vilniusStopPR,
    warsawStopPR,
    bratislavaStopPR,
    viennaStopPR,
    berlinStopDB,
    warsawStopDB,
} = mockStops;
const tgvRouteParisMoscow: ResponseStop[] = [
    parisStopSNCF,
    bruxellesStopSNCF,
    berlinStopSNCF,
    warsawStopSNCF,
    moscowStopSNCF,
];
const dbRouteBerlinWarsaw: ResponseStop[] = [berlinStopDB, warsawStopDB];
const prRouteVilniusVienna: ResponseStop[] = [
    vilniusStopPR,
    warsawStopPR,
    bratislavaStopPR,
    viennaStopPR,
];
const mockedAPIResponseWithConnections: ResponseStop[] = [
    ...tgvRouteParisMoscow,
    ...dbRouteBerlinWarsaw,
    ...prRouteVilniusVienna,
];

describe("makeTrainRoutes", () => {
    it("should generate train routes with direct connections only", () => {
        // Arrange
        const start = "berlin";
        const durationLimit = 600;

        // Act
        const result = makeTrainRoutes(
            tgvRouteParisMoscow,
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
    it("should return route with correct name for route with connection", () => {
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

        // Assert - Check that route name is correct
        const vilniusRoute = result.find(
            (r) => r.lastStation.stop_id === "vilnius",
        );
        expect(vilniusRoute).toBeDefined();
        expect(vilniusRoute?.name).toBe(
            "SNCF, Deutsche Bahn + Polish Railways: Vilnius",
        );
    });
});
