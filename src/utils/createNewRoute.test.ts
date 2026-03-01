import { describe, expect, it } from "vitest";
import { mockStops } from "./_testData";
import { createNewRoute } from "./createNewRoute";

const { parisStopSNCF, bruxellesStopSNCF, berlinStopSNCF } = mockStops;
describe("createNewRoute", () => {
    it("returns a new route with correct stop IDs", () => {
        //arrange
        const stops = [parisStopSNCF, bruxellesStopSNCF, berlinStopSNCF];

        //act
        const actualValue = createNewRoute(parisStopSNCF, stops);

        //assert
        expect(actualValue.stopIds).toEqual(["paris", "bruxelles", "berlin"]);
        // expect(actualValue).toEqual(parisBerlinRoute); // to do: handle trimming names in test data
    });
});
