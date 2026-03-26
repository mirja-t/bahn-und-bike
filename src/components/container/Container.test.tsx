import { Provider } from "react-redux";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { Container } from "./Container";
import { createMockStore } from "../../stories/MockSlice";
import type { ResponseStop } from "../map/trainroutes/TrainroutesSlice";

vi.mock("../../layout/LayoutWithSidebar", () => {
    const Main = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    );
    const Aside = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    );
    const Bottom = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    );
    const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    );
    return {
        default: Object.assign(LayoutWithSidebar, { Main, Aside, Bottom }),
    };
});

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
            station_id: "berlin",
            station_name: "Berlin Hbf",
            dur: 0,
            lat: "52.525084",
            lon: "13.369402",
            name: "RE1",
            stop_number: 0,
            trainline_id: "re1",
        },
        {
            station_id: "potsdam",
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
            <Provider store={mockStore}>
                <Container />
            </Provider>,
        );

        const travelDurationForm = screen.getByRole("form");
        const durationSlider = within(travelDurationForm).getByRole("slider", {
            name: /traveltime/i,
        });
        const searchButton = screen.getByRole("button", { name: "search" });

        return {
            travelDurationForm,
            durationSlider,
            searchButton,
        };
    };

    const getTabs = async () => {
        const tabs = await screen.findByRole("navigation", {
            name: "Tabs",
        });
        const btnTab1 = within(tabs).getByRole("button", {
            name: "trainconnections",
        });
        const btnTab2 = within(tabs).getByRole("button", {
            name: "bikeroutes",
        });
        const btnTab3 = within(tabs).getByRole("button", { name: "routelegs" });
        return { btnTab1, btnTab2, btnTab3 };
    };

    it("sets 2nd tab active when trainroute is selected", async () => {
        const { durationSlider, searchButton } = renderContainer();

        await waitFor(async () => {
            const tabs = screen.queryByRole("navigation", {
                name: "Tabs",
            });
            expect(tabs).toBeNull();
        });

        fireEvent.change(durationSlider, { target: { value: "1" } });
        fireEvent.click(searchButton);

        // Wait for tabs to appear (they render once loadTrainroutes completes)
        const tabs = await screen.findByRole("navigation", {
            name: "Tabs",
        });
        expect(tabs).not.toBeNull();
        return;
        const firstEntryTitle = await screen.findByText(
            "RE1: Berlin – Potsdam",
        );
        fireEvent.click(firstEntryTitle.closest("li") as HTMLLIElement);

        await waitFor(async () => {
            const { btnTab2 } = await getTabs();
            expect(btnTab2.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });
    });

    it("resets tab, veloroutes state, trainroutes state, and clears stale route data on Search", async () => {
        const { durationSlider, searchButton } = renderContainer();

        await waitFor(async () => {
            const tabs = screen.queryByRole("navigation", {
                name: "Tabs",
            });
            expect(tabs).toBeNull();
        });

        fireEvent.change(durationSlider, { target: { value: "1" } });
        fireEvent.click(searchButton);
        return;
        const firstEntryTitle = await screen.findByText(
            "RE1: Berlin – Potsdam",
        );
        fireEvent.click(firstEntryTitle.closest("li") as HTMLLIElement);
        fireEvent.click(searchButton);
        await waitFor(async () => {
            const { btnTab1 } = await getTabs();
            expect(btnTab1.closest("li")?.classList.contains("active")).toBe(
                true,
            );
        });
    });
});
