import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ZoomPanel } from "../components/stateless/zoomPanel/ZoomPanel";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/ZoomPanel",
    component: ZoomPanel,
    decorators: [],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        fn: { action: "zoom" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        fn: fn(),
    },
} satisfies Meta<typeof ZoomPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
