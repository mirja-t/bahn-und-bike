import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["src/setupTests.js"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["**/.storybook/**", "**/*.stories.*"],
        clearMocks: true,
        mockReset: true,
        restoreMocks: true,
    },
});
