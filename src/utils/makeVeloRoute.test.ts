import { describe, it, expect } from "vitest";
import { makeVeloRoute } from "./makeVeloRoute";
import type { VeloroutesResponseStop } from "../components/map/veloroutes/VeloroutesSlice";

describe("makeVeloRoute", () => {
    const trainstops = [1, 3, 4];
    const stops: VeloroutesResponseStop[] = [
        {
            name: "Route 1",
            dest_name: "",
            dist: 0,
            gcs: "0,0",
            lat: "0",
            lon: "0",
            stop_number: 1,
            trainlines: "",
            trainstop: null,
            station_lat: null,
            station_lon: null,
            veloroute_id: "route_1",
            station_name: "Stop 0",
        },
        {
            dest_name: "",
            dist: 5,
            lat: "1",
            lon: "1",
            stop_number: 2,
            trainstop: 1,
            station_lat: "1.02", // ~2.2km from stop 2
            station_lon: "1",
            trainlines: "line_1, line_2",
            veloroute_id: "route_1",
            name: "Route 1",
            gcs: "1,1",
            station_name: "Stop A",
        },
        {
            dest_name: "Stop B",
            dist: 5,
            lat: "2",
            lon: "2",
            stop_number: 3,
            veloroute_id: "route_1",
            name: "Route 1",
            gcs: "2,2",
            trainlines: "",
            trainstop: null,
            station_lat: null,
            station_lon: null,
            station_name: "",
        },
        {
            dest_name: "Stop C",
            dist: 5,
            lat: "3",
            lon: "3",
            stop_number: 4,
            trainstop: 3,
            station_lat: "3",
            station_lon: "3.1", // ~7.8km from stop 4
            trainlines: "line_3",
            veloroute_id: "route_1",
            name: "Route 1",
            gcs: "3,3",
            station_name: "Stop C",
        },
        {
            dest_name: "Stop D",
            dist: 5,
            lat: "4",
            lon: "4",
            stop_number: 5,
            trainstop: 4,
            trainlines: "line_4",
            veloroute_id: "route_1",
            name: "Route 1",
            gcs: "4,4",
            station_name: "Stop D",
            station_lat: "4",
            station_lon: "4", // ~0km from stop D
        },
    ];
    it("should return an array of routes with 2 legs when start and end have trainlines", () => {
        const result = makeVeloRoute(stops.slice(1), trainstops, 1);
        expect(result.route.length).toBe(2);
        // expect(result).toEqual(expectedRoute);
    });
    it("should return an array of routes with 3 legs when start does not have trainlines", () => {
        const result = makeVeloRoute(stops, trainstops, 5);
        expect(result.route.length).toBe(3);
    });
    it("should not create new leg if trainstop is further than maxDistToNextStation", () => {
        const result = makeVeloRoute(stops, trainstops, 3);
        expect(result.route.length).toBe(2);
    });
});
