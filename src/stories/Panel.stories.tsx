import type { Meta, StoryObj } from "@storybook/react-vite";

import { Panel } from "../components/stateless/panel/Panel";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/Panel",
    component: Panel,
    decorators: [],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: { control: "text" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: "Panel content",
    },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        children: "Panel content",
    },
};

export const WithText: Story = {
    args: {
        children: (
            <div>
                <h3>Panel Title</h3>
                <p>This is some text content inside the panel.</p>
            </div>
        ),
    },
};
