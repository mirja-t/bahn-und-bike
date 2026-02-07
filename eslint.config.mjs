// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.strict,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "error",
        },
    },
);

// import tseslint, { parser } from "typescript-eslint";
// import reactHooks from "eslint-plugin-react-hooks";

// export default [
//     {
//         ignores: [
//             "**/*.test.ts",
//             "**/*.test.tsx",
//             "**/stories/**",
//             "**/__mocks__/*",
//             "**/assets/**",
//             "**/.storybook/**",
//         ],
//     },
//     {
//         files: ["**/*.tsx", "**/*.ts"],
//         plugins: {
//             tseslint,
//             "react-hooks": reactHooks,
//         },
//         languageOptions: {
//             parser,
//         },
//         rules: {
//             "@typescript-eslint/no-explicit-any": "error",
//             "no-unused-vars": [
//                 "warn",
//                 {
//                     argsIgnorePattern: "^_", // Allows unused args like (_dark)
//                     varsIgnorePattern: "^_",
//                     ignoreRestSiblings: true,
//                 },
//             ],
//             "react-hooks/rules-of-hooks": "error",
//             "react-hooks/exhaustive-deps": "warn",
//         },
//     },
// ];
