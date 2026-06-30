// trainroutes.test.tsx
import { screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { renderWithProviders } from "@/__mocks__/renderWithProviders";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";
import { TrainlineDetails } from "./TrainlineDetails";
import { mockedTrainroutes } from "@/__mocks__/_testData";

vi.mock("@/api/useTrainroutesQuery", () => ({
    useTrainroutesQuery: vi.fn(),
}));

it("renders trainroutes list", async () => {
    vi.mocked(useTrainroutesQuery).mockReturnValue({
        data: mockedTrainroutes,
        isLoading: false,
    } as ReturnType<typeof useTrainroutesQuery>);

    renderWithProviders(<TrainlineDetails fn={() => {}} />);

    const itemList = await screen.findByTestId("itemlist");
    const routeButtons = within(itemList).getAllByRole("button");
    expect(routeButtons).toHaveLength(3);
});
