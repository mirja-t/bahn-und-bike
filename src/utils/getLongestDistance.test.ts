import { mockedTrainroutes } from "./_testData";
import { getCenterPosition } from "./getCenterPosition";
import { getLongestDistance } from "./getLongestDistance";

it("returns the highest sum of the subtractions of end positions with avarage start position", () => {
    //arrange
    const trainroutes = mockedTrainroutes;
    const xStart = 720;
    const expectedValue = 80;
    
    //act
    const actualValue = getLongestDistance(trainroutes, 'x', xStart);
    
    //assert
    expect(actualValue).toEqual(expectedValue);
  });