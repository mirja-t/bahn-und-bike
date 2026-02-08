import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ItemList } from "../components/stateless/itemlist/ItemList";
import { Provider } from "react-redux";
import { mockStore } from "./MockSlice";

// Mock items data
const mockItems = [
    { id: "1", name: "Berlin-Leipzig Radweg" },
    { id: "2", name: "Elbe Radweg" },
    { id: "3", name: "Oder-Neiße Radweg" },
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Stateless/ItemList",
    component: ItemList,
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
        items: { control: "object" },
        lang: { control: "select", options: ["en", "de"] },
        activeItem: { control: "object" },
        fn: { action: "clicked" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        items: mockItems,
        lang: "en",
        activeItem: null,
        fn: fn(),
    },
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        items: mockItems,
        lang: "en",
        activeItem: null,
    },
};

export const WithActiveItem: Story = {
    args: {
        items: mockItems,
        lang: "en",
        activeItem: mockItems[0],
    },
};
