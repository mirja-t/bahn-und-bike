import { expect, it } from "vitest";
import { mockedTrainroutes } from "../__mocks__/_testData";
import { getLongestDistance } from "./getLongestDistance";

it("returns the highest sum of the subtractions of end positions with avarage start position", () => {
    //arrange
    const trainroutes = mockedTrainroutes;
    const xStart = 720;
    const expectedValue = 80;

    //act
    const actualValue = getLongestDistance(trainroutes, "x", xStart);

    //assert
    expect(actualValue).toEqual(expectedValue);
});
