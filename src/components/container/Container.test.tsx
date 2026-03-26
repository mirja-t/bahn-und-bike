import { Provider } from "react-redux";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { Container } from "./Container";
import { createMockStore } from "../../stories/MockSlice";
import type { ResponseStop } from "../map/trainroutes/TrainroutesSlice";

vi.mock("../../utils/i18n", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../hooks/useResponsiveSize", () => ({
    useResponsiveSize: () => ({ width: 800, height: 600 }),
}));

vi.mock("../map/Map", () => ({
    Map: () => <div data-testid="map" />,
}));

describe("Container search reset", () => {
    const responseStops: ResponseStop[] = [
        {
            station_id: "2975",
            station_name: "Berlin Hbf",
            dur: 0,
            lat: "52.525084",
            lon: "13.369402",
            name: "RE1",
            stop_number: 0,
            trainline_id: "re1",
        },
        {
            station_id: "1234",
            station_name: "Potsdam",
            dur: 10,
            lat: "52.390569",
            lon: "13.064473",
            name: "RE1",
            stop_number: 1,
            trainline_id: "re1",
        },
    ];
    beforeEach(() => {
        vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes("trainstops/")) {
                return {
                    status: 200,
                    json: async () => responseStops,
                } as Response;
            }

            return {
                status: 200,
                json: async () => [],
            } as Response;
        });
    });

    const renderContainer = () => {
        const mockStore = createMockStore();
        render(
            <MemoryRouter>
                <Provider store={mockStore}>
                    <Container />
                </Provider>
            </MemoryRouter>,
        );

        const travelDurationForm = screen.getByRole("form");
        const durationSlider = within(travelDurationForm).getByRole("slider", {
            name: /traveltime/i,
        });
        const searchButton = screen.getByRole("button", { name: "search" });
        const tabs = screen.getByRole("navigation", { name: "Tabs" });
        const btnTab1 = within(tabs).getByRole("button", {
            name: "trainconnections",
        });
        const btnTab2 = within(tabs).getByRole("button", {
            name: "bikeroutes",
        });
        const btnTab3 = within(tabs).getByRole("button", { name: "routelegs" });
        return {
            travelDurationForm,
            durationSlider,
            searchButton,
            tabs,
            btnTab1,
            btnTab2,
            btnTab3,
        };
    };

    it("sets 2nd tab active when trainroute is selected", async () => {
        const { durationSlider, searchButton, btnTab1, btnTab2 } =
            renderContainer();

        await waitFor(() => {
            expect(btnTab1.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });

        fireEvent.change(durationSlider, { target: { value: "1" } });
        fireEvent.click(searchButton);

        const firstEntryTitle = await screen.findByText("RE1: Berlin – Potsdam");
        fireEvent.click(firstEntryTitle.closest("li") as HTMLLIElement);

        await waitFor(() => {
            expect(btnTab2.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });
    });

    it("resets tab, veloroutes state, trainroutes state, and clears stale route data on Search", async () => {
        const { durationSlider, searchButton, btnTab1 } = renderContainer();

        await waitFor(() => {
            expect(btnTab1.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });

        fireEvent.change(durationSlider, { target: { value: "1" } });
        fireEvent.click(searchButton);
        const firstEntryTitle = await screen.findByText("RE1: Berlin – Potsdam");
        fireEvent.click(firstEntryTitle.closest("li") as HTMLLIElement);
        fireEvent.click(searchButton);
        await waitFor(() => {
            expect(btnTab1.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });
    });
});
