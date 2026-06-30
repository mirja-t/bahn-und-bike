// trainroutes.test.tsx
import { screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderWithProviders } from "@/__mocks__/renderWithProviders";
import { TrainlineDetails } from "./TrainlineDetails";

it("renders trainroutes list", async () => {
    renderWithProviders(<TrainlineDetails fn={() => {}} />, {
        preloadedState: {
            trainroutes: {
                startPos: 2975,
                isDirect: true,
                travelInterval: 30,
                travelDuration: 1,
                activeSpot: null,
                activeSectionId: null,
                previewSectionId: null,
            },
        },
    });

    const itemList = await screen.findByTestId("itemlist");
    const routeButtons = within(itemList).getAllByRole("button");
    expect(routeButtons).toHaveLength(2);
});
