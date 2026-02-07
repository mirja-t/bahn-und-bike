// @ts-check

import tseslint from "typescript-eslint";

export default [
    ...tseslint.configs.strict,
    { ignores: ["**/*.js"] },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
];

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
