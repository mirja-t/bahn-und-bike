import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: "unit",
                    environment: "jsdom",
                    setupFiles: ["src/setupTests.js"],
                    include: ["src/**/*.{test,spec}.{ts,tsx}"],
                    exclude: ["**/.storybook/**", "**/*.stories.*"],
                    clearMocks: true,
                    mockReset: true,
                    restoreMocks: true,
                },
            },
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, ".storybook"),
                    }),
                ],
                test: {
                    name: "storybook",
                    environment: "jsdom",
                    setupFiles: [".storybook/vitest.setup.ts"],
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
    },
});
