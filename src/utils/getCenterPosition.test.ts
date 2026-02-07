import { expect, it } from "vitest";
import { mockedTrainroutes } from "./_testData";
import { getCenterPosition } from "./getCenterPosition";

it("returns the avarage middle position of all start positions of a journeys array", () => {
    //arrange
    const trainroutes = mockedTrainroutes;
    const expectedValue = 720;

    //act
    const actualValue = getCenterPosition(trainroutes, "x");

    //assert
    expect(actualValue).toEqual(expectedValue);
});
