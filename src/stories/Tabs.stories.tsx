import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Tabs from "../components/stateless/tabs/Tabs";
import { ItemList } from "../components/stateless/itemlist/ItemList";
import { Panel } from "../components/stateless/panel/Panel";
import { Provider } from "react-redux";
import { mockStore } from "./MockSlice";

// Mock content components for demonstration
const MockTrainContent = () => (
    <div style={{ padding: "1rem" }}>
        <h3>Train Lines</h3>
        <p>Information about available train lines and connections.</p>
        <ItemList
            items={[
                { id: "1", name: "ICE 123 - Berlin → Hamburg" },
                { id: "2", name: "RE 456 - Berlin → Dresden" },
                { id: "3", name: "S1 - Wannsee → Oranienburg" },
            ]}
        />
    </div>
);

const MockCycleContent = () => (
    <div style={{ padding: "1rem" }}>
        <h3>Cycling Routes</h3>
        <p>Bike-friendly routes and cycling paths.</p>
        <ul>
            <li>Berlin Wall Trail - 160km</li>
            <li>Spree Cycle Path - 410km</li>
            <li>Havel Cycle Path - 371km</li>
        </ul>
    </div>
);

const MockSegmentContent = () => (
    <div style={{ padding: "1rem" }}>
        <h3>Route Segments</h3>
        <p>Detailed breakdown of route segments and connections.</p>
        <ItemList
            items={[
                { id: "1", name: "Segment A - Train" },
                { id: "2", name: "Segment B - Bike" },
                { id: "3", name: "Segment C - Walk" },
            ]}
        />
    </div>
);

const meta = {
    title: "Stateless/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <Provider store={mockStore}>
                <Story />
            </Provider>
        ),
    ],
    argTypes: {
        children: { control: false },
        height: { control: "text" },
        activeTabId: { control: "text" },
        handleTabClick: { action: "tab-clicked" },
    },
    args: {
        height: "400px",
        handleTabClick: fn(),
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic tabs with default behavior
export const Default: Story = {
    args: {
        children: [
            <Tabs.Tab key="trains" id="trains" name="Trains">
                <MockTrainContent />
            </Tabs.Tab>,
            <Tabs.Tab key="cycling" id="cycling" name="Cycling">
                <MockCycleContent />
            </Tabs.Tab>,
            <Tabs.Tab key="segments" id="segments" name="Segments">
                <MockSegmentContent />
            </Tabs.Tab>,
        ],
    },
};

// Tabs with disabled states
export const WithDisabledTabs: Story = {
    args: {
        children: [
            <Tabs.Tab key="trains" id="trains" name="Trains">
                <MockTrainContent />
            </Tabs.Tab>,
            <Tabs.Tab key="cycling" id="cycling" name="Cycling" disabled={true}>
                <MockCycleContent />
            </Tabs.Tab>,
            <Tabs.Tab
                key="segments"
                id="segments"
                name="Segments"
                disabled={true}
            >
                <MockSegmentContent />
            </Tabs.Tab>,
        ],
    },
};

// Tabs with external control
export const ControlledTabs: Story = {
    args: {
        children: <></>,
    },
    render: (args) => {
        const [activeTab, setActiveTab] = useState("trains");

        return (
            <div>
                <div style={{ marginBottom: "1rem" }}>
                    <button
                        onClick={() => setActiveTab("trains")}
                        style={{ marginRight: "0.5rem", padding: "0.5rem" }}
                    >
                        Activate Trains Tab
                    </button>
                    <button
                        onClick={() => setActiveTab("cycling")}
                        style={{ marginRight: "0.5rem", padding: "0.5rem" }}
                    >
                        Activate Cycling Tab
                    </button>
                    <button
                        onClick={() => setActiveTab("segments")}
                        style={{ padding: "0.5rem" }}
                    >
                        Activate Segments Tab
                    </button>
                </div>
                <Tabs
                    {...args}
                    activeTabId={activeTab}
                    handleTabClick={setActiveTab}
                >
                    <Tabs.Tab id="trains" name="Trains">
                        <MockTrainContent />
                    </Tabs.Tab>
                    <Tabs.Tab id="cycling" name="Cycling">
                        <MockCycleContent />
                    </Tabs.Tab>
                    <Tabs.Tab id="segments" name="Segments">
                        <MockSegmentContent />
                    </Tabs.Tab>
                </Tabs>
            </div>
        );
    },
};

// Compact tabs with shorter height
export const Compact: Story = {
    decorators: [
        (Story) => (
            <Panel>
                <Story />
            </Panel>
        ),
    ],
    args: {
        height: "200px",
        children: [
            <Tabs.Tab key="info" id="info" name="Info">
                <div style={{ padding: "1rem" }}>
                    <h4>Quick Info</h4>
                    <p>Essential information in a compact view.</p>
                </div>
            </Tabs.Tab>,
            <Tabs.Tab key="details" id="details" name="Details">
                <h4>Details</h4>
                <p>More detailed information when needed.</p>
            </Tabs.Tab>,
        ],
    },
};

// Single tab scenario
export const SingleTab: Story = {
    args: {
        children: [
            <Tabs.Tab key="only" id="only" name="Only Tab">
                <div style={{ padding: "1rem" }}>
                    <h3>Single Tab Content</h3>
                    <p>Sometimes you only have one tab active.</p>
                </div>
            </Tabs.Tab>,
        ],
    },
};
