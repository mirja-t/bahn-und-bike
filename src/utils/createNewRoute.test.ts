import { expect, it } from "vitest";
import { mockStops } from "./_testData";
import { createNewRoute } from "./createNewRoute";
import { describe } from "node:test";

const { parisStop, bruxellesStop, berlinStop } = mockStops;
describe("createNewRoute", () => {
    it("returns a new route with correct stop IDs", () => {
        //arrange
        const stops = [parisStop, bruxellesStop, berlinStop];

        //act
        const actualValue = createNewRoute(parisStop, stops);

        //assert
        expect(actualValue.stopIds).toEqual(["paris", "bruxelles", "berlin"]);
        // expect(actualValue).toEqual(parisBerlinRoute); // to do: handle trimming names in test data
    });
});
