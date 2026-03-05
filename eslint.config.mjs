// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import hooksPlugin from "eslint-plugin-react-hooks";
// @ts-check

import tseslint from "typescript-eslint";

export default [
    ...tseslint.configs.strict,
    { ignores: ["**/*.js"] },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "error",
        },
        plugins: { "react-hooks": hooksPlugin },
    },
    ...storybook.configs["flat/recommended"],
];
