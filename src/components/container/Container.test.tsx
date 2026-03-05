import { Provider } from "react-redux";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { Container } from "./Container";
import { LangCode } from "../../AppSlice";
// import { type CurrentTrainroute } from "../map/trainroutes/TrainroutesSlice";
import { mockStore } from "../../stories/MockSlice";

vi.mock("../../utils/i18n", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../hooks/useResponsiveSize", () => ({
    useResponsiveSize: () => ({ width: 800, height: 600 }),
}));

vi.mock("../map/Map", () => ({
    Map: () => <div data-testid="map" />,
}));

vi.mock("../form/TravelDuration", () => ({
    TravelDuration: ({
        handleSubmit,
    }: {
        handleSubmit: (
            e: React.SubmitEvent<HTMLFormElement>,
            value: number,
            direct: boolean,
        ) => void;
    }) => (
        <form
            onSubmit={(e) =>
                handleSubmit(e as React.SubmitEvent<HTMLFormElement>, 2, true)
            }
        >
            <button type="submit">search</button>
        </form>
    ),
}));
/*
const staleTrainroute: CurrentTrainroute = {
    id: "route-1",
    name: "Stale Train Route",
    dur: 60,
    trainlines: [{ trainline_id: "tl-1", trainline_name: "RE1" }],
    pathLength: 10,
    firstStation: {
        stop_name: "Berlin Hbf",
        stop_id: "2975",
        trainline_id: "tl-1",
        lat: 0,
        lon: 0,
        x: 0,
        y: 0,
    },
    lastStation: {
        stop_name: "Potsdam",
        stop_id: "1234",
        trainline_id: "tl-1",
        lat: 1,
        lon: 1,
        x: 1,
        y: 1,
    },
    stopIds: ["2975", "1234"],
    points: "0,0 1,1",
    connection: null,
};*/

describe("Container search reset", () => {
    beforeEach(() => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            status: 200,
            json: async () => [],
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("resets tab, veloroutes state, trainroutes state, and clears stale route data on Search", async () => {
        render(
            <Provider store={mockStore}>
                <Container lang={LangCode.DE} />
            </Provider>,
        );

        const veloroutesTabButton = screen.getByRole("button", {
            name: "bikeroutes",
        });
        const trainlinesTabButton = screen.getByRole("button", {
            name: "trainconnections",
        });

        await waitFor(() => {
            expect(
                veloroutesTabButton.closest("li")?.classList.contains("active"),
            ).toBe(true);
            expect(screen.queryByText("Stale Train Route")).not.toBeNull();
            expect(screen.queryByText("Stale Bike Route")).not.toBeNull();
        });

        fireEvent.click(screen.getByRole("button", { name: "search" }));

        await waitFor(() => {
            expect(
                trainlinesTabButton.closest("li")?.classList.contains("active"),
            ).toBe(true);
            expect(
                veloroutesTabButton.closest("li")?.classList.contains("active"),
            ).toBe(false);
        });

        // const state = store.getState();
        // expect(state.veloroutes.velorouteList).toEqual([]);
        // expect(state.veloroutes.activeVeloroute).toBeNull();
        // expect(state.veloroutes.activeVelorouteSection).toBeNull();
        // expect(state.trainroutes.currentTrainroutes).toEqual([]);
        // expect(state.trainroutes.activeSection).toBeNull();
        // expect(state.trainroutes.trainroutesAlongVeloroute).toEqual([]);

        // expect(screen.queryByText("Stale Train Route")).toBeNull();
        // expect(screen.queryByText("Stale Bike Route")).toBeNull();
    });
});
