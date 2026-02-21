import { describe, it, expect } from "vitest";
import { makeVeloRoute } from "./makeVeloRoute";
import type { ResponseStop } from "../components/map/veloroutes/VeloroutesSlice";

describe("makeVeloRoute", () => {
    const trainlines = ["line_1", "line_2", "line_3", "line_4"];
    const stops: ResponseStop[] = [
        {
            id: "0",
            dest_name: "Stop 0",
            dist: 0,
            lat: "0",
            lon: "0",
            stop_number: 1,
            veloroute_id: "route_1",
        },
        {
            id: "1",
            dest_name: "Stop A",
            dist: 5,
            lat: "1",
            lon: "1",
            stop_number: 2,
            trainstop: "trainstop_a",
            trainlines: "line_1, line_2",
            veloroute_id: "route_1",
        },
        {
            id: "2",
            dest_name: "Stop B",
            dist: 5,
            lat: "2",
            lon: "2",
            stop_number: 3,
            veloroute_id: "route_1",
        },
        {
            id: "3",
            dest_name: "Stop C",
            dist: 5,
            lat: "3",
            lon: "3",
            stop_number: 4,
            trainstop: "trainstop_c",
            trainlines: "line_3",
            veloroute_id: "route_1",
        },
        {
            id: "4",
            dest_name: "Stop D",
            dist: 5,
            lat: "4",
            lon: "4",
            stop_number: 5,
            trainstop: "trainstop_d",
            trainlines: "line_4",
            veloroute_id: "route_1",
        },
    ];
    it("should return an array of routes with 2 legs when start and end have trainlines", () => {
        /*
        const expectedRoute: Veloroute = {
            id: "route_1",
            name: "Route 1",
            len: 20,
            path: ["M1 1 L2 2 L3 3 L4 4"],
            route: [
                {
                    dist: 0,
                    leg: [
                        {
                            stop_id: "1",
                            stop_name: "Stop A",
                            trainlines: ["line_1, line_2"],
                            x: expect.any(Number),
                            y: expect.any(Number),
                        },
                        {
                            stop_id: "2",
                            stop_name: "Stop B",
                            x: expect.any(Number),
                            y: expect.any(Number),
                        },
                        {
                            stop_id: "3",
                            stop_name: "Stop C",
                            trainlines: ["line_3"],
                            x: expect.any(Number),
                            y: expect.any(Number),
                        },
                    ],
                },
                {
                    dist: 0,
                    leg: [
                        {
                            stop_id: "3",
                            stop_name: "Stop C",
                            trainlines: ["line_3"],
                            x: expect.any(Number),
                            y: expect.any(Number),
                        },
                        {
                            stop_id: "4",
                            stop_name: "Stop D",
                            trainlines: ["line_4"],
                            x: expect.any(Number),
                            y: expect.any(Number),
                        },
                    ],
                },
            ],
        };*/

        const result = makeVeloRoute(stops.slice(1), "Route 1", trainlines);
        expect(result.route.length).toBe(2);
        // expect(result).toEqual(expectedRoute);
    });
    it("should return an array of routes with 3 legs when start does not have trainlines", () => {
        const result = makeVeloRoute(stops, "Route 1", trainlines);
        expect(result.route.length).toBe(3);
    });
});
