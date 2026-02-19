import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/index.scss";
import "../src/App.scss";

export const globalTypes = {
    theme: {
        name: "Theme",
        description: "Global theme for components",
        defaultValue: "light",
        toolbar: {
            icon: "paintbrush",
            items: [
                { value: "light", title: "Light" },
                { value: "dark", title: "Dark" },
                // add more if you have them:
                // { value: "solarized", title: "Solarized" },
            ],
            dynamicTitle: true,
        },
    },
};

const withTheme: Decorator = (Story, context) => {
    const theme = context.globals.theme as string;

    const root = document.documentElement; // <html> inside Storybook iframe
    // remove previous theme-* classes
    root.className = root.className.replace(/\btheme-\S+/g, "").trim();
    root.classList.add(`theme-${theme}`);

    // wrap the story
    return (
        <div
            className="App"
            style={{
                padding: "3em",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Story />
        </div>
    );
};

const preview: Preview = {
    decorators: [withTheme],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
    },
};

export default preview;
