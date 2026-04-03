import { describe, it, expect } from "vitest";
import { makeVeloRoute } from "./makeVeloRoute";
import type { VelorouteStop } from "../components/map/veloroutes/VeloroutesSlice";

describe("makeVeloRoute", () => {
    const stops: (VelorouteStop & { dist: number; gcs: string })[] = [
        {
            stop_id: "stop_1",
            stop_name: "Stop 1",
            trainstop: null,
            x: 0,
            y: 0,
            dist: 0,
            gcs: "0,0",
            lat: 0,
            lon: 0,
            trainlines: [],
        },
        {
            stop_id: "stop_2",
            stop_name: "Stop 2",
            trainstop: 1,
            distToTrainstation: 0.5,
            x: 1,
            y: 1,
            dist: 5,
            lat: 1,
            lon: 1,
            trainlines: ["line_1", "line_2"],
            gcs: "1,1",
        },
        {
            stop_id: "stop_3",
            stop_name: "Stop B",
            trainstop: null,
            x: 2,
            y: 2,
            dist: 5,
            lat: 2,
            lon: 2,
            gcs: "2,2",
            trainlines: [],
        },
        {
            stop_id: "stop_3",
            stop_name: "Stop C",
            trainstop: 3,
            distToTrainstation: 4.5,
            dist: 5,
            lat: 3,
            lon: 3,
            trainlines: ["line_3"],
            gcs: "3,3",
            x: 3,
            y: 3,
        },
        {
            stop_id: "stop_4",
            stop_name: "Stop D",
            trainstop: 4,
            x: 4,
            y: 4,
            dist: 5,
            lat: 4,
            lon: 4,
            distToTrainstation: 2,
            trainlines: ["line_4"],
            gcs: "4,4",
        },
    ];
    it("should return an array of routes with 2 legs when start and end have trainlines", () => {
        const result = makeVeloRoute(
            stops.slice(1),
            [1, 2, 3, 4],
            5,
            "route_1",
            "Route 1",
        );
        expect(result.route.length).toBe(2);
        // expect(result).toEqual(expectedRoute);
    });
    it("should return an array of routes with 3 legs when start does not have trainlines", () => {
        const result = makeVeloRoute(
            stops,
            [1, 2, 3, 4],
            5,
            "route_1",
            "Route 1",
        );
        expect(result.route.length).toBe(3);
    });
    it("should not create new leg if trainstop is further than maxDistToNextStation", () => {
        const result = makeVeloRoute(
            stops.slice(1),
            [1, 2, 3, 4],
            3,
            "route_1",
            "Route 1",
        );
        expect(result.route.length).toBe(1);
    });
});
