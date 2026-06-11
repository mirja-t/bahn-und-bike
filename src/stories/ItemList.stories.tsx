import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Provider } from "react-redux";
import { createMockStore } from "./MockSlice";

import { ItemList } from "@/components/stateless/itemlist/ItemList";
import { TrainIcon } from "@/components/stateless/icons/TrainIcon";
import { VelorouteIcon } from "@/components/stateless/icons/VelorouteIcon";

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
            <Provider store={createMockStore()}>
                <Story />
            </Provider>
        ),
    ],
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        items: { control: "object" },
        activeId: { control: "text" },
        onClick: { action: "clicked" },
        icon: { control: "text" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        items: mockItems,
        onClick: fn(),
        icon: <VelorouteIcon />,
    },
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Veloroute: Story = {
    args: {
        items: mockItems,
        icon: <VelorouteIcon />,
    },
};
export const Train: Story = {
    args: {
        items: mockItems,
        icon: <TrainIcon />,
    },
};

export const WithActiveItem: Story = {
    args: {
        items: mockItems,
        activeId: mockItems[0].id,
        icon: <VelorouteIcon />,
    },
};
