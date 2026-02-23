import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Select } from "../components/stateless/select/Select";

const meta = {
    title: "Stateless/Select",
    component: Select,
    tags: ["autodocs"],
    argTypes: {
        options: { control: "object" },
        label: { control: "text" },
        fn: { action: "selection-changed" },
    },
    args: {
        fn: fn(),
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic select with cities
export const WithLabel: Story = {
    args: {
        label: "Select City",
        options: [
            { value: "berlin", label: "Berlin" },
            { value: "hamburg", label: "Hamburg" },
            { value: "munich", label: "Munich" },
            { value: "cologne", label: "Cologne" },
            { value: "frankfurt", label: "Frankfurt" },
        ],
    },
};
export const WithoutLabel: Story = {
    args: {
        options: [
            { value: "berlin", label: "Berlin" },
            { value: "hamburg", label: "Hamburg" },
            { value: "munich", label: "Munich" },
            { value: "cologne", label: "Cologne" },
            { value: "frankfurt", label: "Frankfurt" },
        ],
    },
};
export const WithPreselectedValue: Story = {
    args: {
        options: [
            { value: "berlin", label: "Berlin" },
            { value: "hamburg", label: "Hamburg" },
            { value: "munich", label: "Munich" },
            { value: "cologne", label: "Cologne" },
            { value: "frankfurt", label: "Frankfurt" },
        ],
        preselectedValue: "munich",
        label: "Select City",
    },
};
