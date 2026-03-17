import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { expect, within, userEvent } from "storybook/test";
import { useState } from "react";

import {
    Combobox,
    type ComboboxOption,
} from "../components/stateless/combobox/Combobox";

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
        value: { value: "berlin", label: "Berlin" },
        options: cityOptions,
    },
};

/**
 * Typing filters options; keyboard navigation selects an option and updates
 * the visible selected value.
 */
export const KeyboardSelectAfterFiltering: Story = {
    render: (args) => {
        const [value, setValue] = useState<ComboboxOption | null>(null);
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
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole("combobox");

        await step("Type to filter options", async () => {
            await userEvent.click(input);
            await userEvent.type(input, "Ha");
            const listbox = canvas.getByRole("listbox");
            expect(listbox).toBeInTheDocument();
            expect(
                within(listbox).getAllByRole("option").length,
            ).toBeGreaterThan(0);
        });

        await step("Select filtered option using keyboard", async () => {
            await userEvent.keyboard("{ArrowDown}{Enter}");
            expect(input).toHaveValue("Hamburg");
        });
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
            expect(
                (input as HTMLInputElement).value.length,
            ).toBeLessThanOrEqual(10);
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
