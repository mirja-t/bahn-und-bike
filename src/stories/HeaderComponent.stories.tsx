import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header } from "../components/stateless/header/Header";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/Header",
    component: Header,
    decorators: [],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: { control: "text" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: "Header content",
    },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        children: "Header content",
    },
};

export const WithNavigation: Story = {
    args: {
        children: (
            <nav>
                <h1>Bahn & Bike</h1>
                <div>Language selector</div>
            </nav>
        ),
    },
};
