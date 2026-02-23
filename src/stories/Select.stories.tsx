import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, userEvent } from "storybook/test";

import { Select } from "../components/stateless/select/Select";

const meta = {
    title: "Stateless/Select",
    component: Select,
    tags: ["autodocs"],
    argTypes: {
        options: { control: "object" },
        label: { control: "text" },
        onChange: { action: "selection-changed" },
    },
    args: {
        onChange: fn(),
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
        name: "city-select",
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const select = canvas.getByRole("combobox");

        expect(select).toHaveValue("berlin");
        await step(
            "Select shows the correct value after selection",
            async () => {
                await userEvent.selectOptions(select, "munich");
                expect(select).toHaveValue("munich");
            },
        );
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
        name: "city-select",
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
        name: "city-select",
    },
};
export const WithLongLabel: Story = {
    args: {
        options: [
            { value: "berlin", label: "Berlin" },
            { value: "hamburg", label: "Hamburg" },
            { value: "munich", label: "Munich" },
            { value: "cologne", label: "Cologne" },
            { value: "frankfurt", label: "Frankfurt" },
        ],
        label: "Select City with a Long Label",
        name: "city-select",
    },
};
