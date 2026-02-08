import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "../components/stateless/loading/Loading";
import { Provider } from "react-redux";
import { mockStore } from "./MockSlice";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/Loading",
    component: Loading,
    decorators: [
        (Story) => (
            <Provider store={mockStore}>
                <Story />
            </Provider>
        ),
    ],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        lang: { control: "select", options: ["en", "de"] },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        lang: "en",
    },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        lang: "en",
    },
};
