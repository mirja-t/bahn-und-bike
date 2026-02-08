import type { Meta, StoryObj } from "@storybook/react-vite";

import { Footer } from "../components/stateless/footer/Footer";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/Footer",
    component: Footer,
    decorators: [],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: { control: "text" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: "Footer content",
    },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        children: "Footer content",
    },
};

export const WithComplexContent: Story = {
    args: {
        children: (
            <div>
                <p>© 2024 Bahn & Bike</p>
                <p>Privacy Policy | Terms of Service</p>
            </div>
        ),
    },
};
