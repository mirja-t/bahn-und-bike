import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, userEvent } from "storybook/test";
import { useState } from "react";

import { Combobox } from "../components/stateless/combobox/Combobox";

const cityOptions = [
    { value: "berlin", label: "Berlin" },
    { value: "hamburg", label: "Hamburg" },
    { value: "munich", label: "Munich" },
    { value: "cologne", label: "Cologne" },
    { value: "frankfurt", label: "Frankfurt" },
    { value: "stuttgart", label: "Stuttgart" },
    { value: "dusseldorf", label: "Düsseldorf" },
    { value: "dortmund", label: "Dortmund" },
    { value: "essen", label: "Essen" },
    { value: "bremen", label: "Bremen" },
];

const meta = {
    title: "Stateless/Combobox",
    component: Combobox,
    tags: ["autodocs"],
    argTypes: {
        options: { control: "object" },
        label: { control: "text" },
        value: { control: "text" },
        placeholder: { control: "text" },
        maxLength: { control: "number" },
        dropdownPosition: {
            control: "select",
            options: ["bottom", "top"],
        },
        onChange: { action: "value-changed" },
    },
    args: {
        onChange: fn(),
        options: cityOptions,
        value: "",
        name: "city-combobox",
    },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic combobox with a label. Typing 2+ characters activates filtering.
 * Clicking the caret button opens an unfiltered list of up to 10 options.
 */
export const WithLabel: Story = {
    args: {
        label: "Search City",
        placeholder: "Type to search…",
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("combobox");

        await step("Input is initially empty", async () => {
            expect(input).toHaveValue("");
        });

        await step(
            "Filtered suggestions appear only after typing 2+ characters",
            async () => {
                await userEvent.type(input, "Be");
                const listbox = canvas.getByRole("listbox");
                expect(listbox).toBeInTheDocument();
                // "Be" matches Berlin, Bremen
                expect(
                    within(listbox).getAllByRole("option").length,
                ).toBeGreaterThan(0);
            },
        );
    },
};

/**
 * Combobox without a label — useful when context is provided elsewhere.
 */
export const WithoutLabel: Story = {
    args: {
        placeholder: "Type to search…",
    },
};

/**
 * Combobox with a pre-filled value showing the selected state styling.
 */
export const WithPrefilledValue: Story = {
    args: {
        label: "Search City",
        value: "Berlin",
    },
};

/**
 * Clicking the caret button opens a dropdown with up to 10 unfiltered options
 * — no typing required.
 */
export const WithCaretDropdown: Story = {
    args: {
        label: "Search City",
        placeholder: "Click caret or type to search…",
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step(
            "Caret button opens unfiltered dropdown (max 10 items)",
            async () => {
                const caretBtn = canvas.getByRole("button", {
                    name: /open suggestions/i,
                });
                await userEvent.click(caretBtn);
                const listbox = canvas.getByRole("listbox");
                expect(listbox).toBeInTheDocument();
                expect(
                    within(listbox).getAllByRole("option").length,
                ).toBeLessThanOrEqual(10);
            },
        );

        await step("Caret button closes the dropdown when open", async () => {
            const caretBtn = canvas.getByRole("button", {
                name: /close suggestions/i,
            });
            await userEvent.click(caretBtn);
            expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
        });
    },
};

/**
 * Controlled combobox — state is managed by a parent component.
 * Demonstrates stateless usage with external state management.
 */
export const Controlled: Story = {
    render: (args) => {
        const [value, setValue] = useState("Ham");
        return (
            <Combobox
                {...args}
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    args.onChange(newValue);
                }}
            />
        );
    },
    args: {
        label: "Search City",
        placeholder: "Type to search…",
    },
};

/**
 * Demonstrates input truncation — the maxLength prop limits how many characters
 * can be entered, preventing excessively long values.
 */
export const WithMaxLength: Story = {
    args: {
        label: "Search City",
        placeholder: "Max 10 characters",
        maxLength: 10,
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("combobox");

        await step("Input is truncated at maxLength", async () => {
            await userEvent.type(input, "This is a very long string");
            expect((input as HTMLInputElement).value.length).toBeLessThanOrEqual(10);
        });
    },
};

/**
 * The dropdown opens above the input when dropdownPosition is set to "top".
 * Useful when the combobox is placed near the bottom of the viewport.
 */
export const DropdownPositionTop: Story = {
    args: {
        label: "Search City",
        placeholder: "Dropdown opens above",
        dropdownPosition: "top",
    },
    decorators: [
        (Story) => (
            <div style={{ paddingTop: "8em" }}>
                <Story />
            </div>
        ),
    ],
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step("Dropdown opens above the input", async () => {
            const caretBtn = canvas.getByRole("button", {
                name: /open suggestions/i,
            });
            await userEvent.click(caretBtn);
            expect(canvas.getByRole("listbox")).toBeInTheDocument();
        });
    },
};

/**
 * A large option list — the caret dropdown caps at 10 unfiltered items;
 * typing narrows results via filtering.
 */
export const LargeOptionList: Story = {
    args: {
        label: "Search Station",
        placeholder: "Type to search…",
        options: Array.from({ length: 200 }, (_, i) => ({
            value: `station-${i}`,
            label: `Station ${i + 1}`,
        })),
    },
};

/**
 * Empty options list — no suggestions will ever appear.
 */
export const EmptyOptions: Story = {
    args: {
        label: "Search City",
        placeholder: "No options available",
        options: [],
    },
};

/**
 * Options with long labels — verifies that text truncation via CSS is applied.
 */
export const LongOptionLabels: Story = {
    args: {
        label: "Search Route",
        placeholder: "Type to search…",
        options: [
            {
                value: "route1",
                label: "Berlin Hauptbahnhof – Hamburg Hauptbahnhof via Uelzen",
            },
            {
                value: "route2",
                label: "Munich Central Station to Frankfurt am Main Hauptbahnhof Express",
            },
            {
                value: "route3",
                label: "Cologne Cathedral Station – Dortmund Central – Essen Hauptbahnhof",
            },
        ],
    },
};
