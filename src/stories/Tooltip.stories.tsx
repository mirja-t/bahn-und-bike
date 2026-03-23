import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip } from "../components/stateless/tooltip/Tooltip";

const meta = {
    title: "Stateless/Tooltip",
    component: Tooltip,
    decorators: [],
    tags: ["autodocs"],
    argTypes: {
        content: { control: "text" },
        children: { control: "text" },
    },
    args: {
        content: "Tooltip text",
        children: "Hover or tap me!",
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const LongText: Story = {
    args: {
        content: (
            <div style={{ width: "200px" }}>
                This tooltip includes a longer message to preview wrapping
                behavior.
            </div>
        ),
        children: (
            <div
                style={{
                    width: "max(fit-content, 100px)",
                    padding: "0.5em",
                    background: "var(--train)",
                    borderRadius: "var(--border-radius)",
                }}
            >
                Hover me!
            </div>
        ),
    },
};
export const Permanent: Story = {
    args: {
        content: (
            <div style={{ width: "200px" }}>
                This tooltip includes a longer message to preview wrapping
                behavior.
            </div>
        ),
        children: (
            <div
                style={{
                    width: "max(fit-content, 100px)",
                    padding: "0.5em",
                    background: "var(--train)",
                    borderRadius: "var(--border-radius)",
                }}
            >
                More info
            </div>
        ),
        permanent: true,
    },
};
export const ShowOnClick: Story = {
    args: {
        content:
            "This tooltip includes a longer message to preview wrapping behavior.",
        children: (
            <div
                style={{
                    width: "max(fit-content, 100px)",
                    padding: "0.5em",
                    background: "var(--train)",
                    borderRadius: "var(--border-radius)",
                }}
            >
                Click me!
            </div>
        ),
        showOnHover: false,
    },
};
