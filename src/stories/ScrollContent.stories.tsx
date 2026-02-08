import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollContent } from "../components/stateless/scrollcontent/ScrollContent";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/ScrollContent",
    component: ScrollContent,
    decorators: [],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: { control: "text" },
        parentEl: { control: "object" },
        transitionComplete: { control: "boolean" },
        id: { control: "text" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: (
            <div style={{ height: "800px" }}>
                <p>This is scrollable content.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa.</p>
                <p>Qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
                <p>Accusantium doloremque laudantium, totam rem aperiam.</p>
                <p>Eaque ipsa quae ab illo inventore veritatis et quasi.</p>
            </div>
        ),
        parentEl: null,
        transitionComplete: true,
        id: "scroll-content",
    },
} satisfies Meta<typeof ScrollContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};

export const ShortContent: Story = {
    args: {
        children: (
            <div>
                <p>This is short content that doesn't need scrolling.</p>
            </div>
        ),
        transitionComplete: true,
        id: "short-content",
    },
};

export const TransitionInProgress: Story = {
    args: {
        transitionComplete: false,
        id: "transition-content",
    },
};
