import duploLint from "@duplojs/eslint";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

const tsxReactRules = {
	"eol-last": ["error", "always"],
	semi: ["error", "always"],
	"no-extra-semi": "error",
	quotes: ["error", "double"],
	indent: ["error", "tab"],
	"object-curly-newline": [
		"error",
		{
			ObjectExpression: {
				consistent: true,
				multiline: true,
				minProperties: 4,
			},
		},
	],
	"object-curly-spacing": ["error", "always"],
	"array-bracket-newline": [
		"error",
		{
			multiline: true,
			minItems: 4,
		},
	],
	"array-bracket-spacing": ["error", "never"],
	"key-spacing": ["error", { beforeColon: false }],
	"keyword-spacing": [
		"error",
		{
			before: true,
			after: true,
		},
	],
	"space-in-parens": ["error", "never"],
	"arrow-spacing": [
		"error",
		{
			before: true,
			after: true,
		},
	],
	"space-before-blocks": ["error", "always"],
	"func-call-spacing": ["error", "never"],
	"react/jsx-uses-react": "off",
};

export default [
	{
		...duploLint,
		languageOptions: {
			...duploLint.languageOptions,
			globals: {
				vi: true,
				describe: true,
				it: true,
				expect: true,
				beforeEach: true,
				afterEach: true,
				beforeAll: true,
				afterAll: true,
				...globals.browser,
				React: "readonly",
			},
		},
		rules: {
			...duploLint.rules,
			...tsxReactRules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-unnecessary-type-parameters": "off",
			"func-style": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
		},
		ignores: ["**/*.d.ts", ".build", "rollup.config.js", "eslint.config.js"],
	},
	{
		...duploLint,
		rules: {
			...duploLint.rules,
			"max-classes-per-file": "off",
			"@typescript-eslint/no-explicit-any": "off",
		},
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 2020,
				sourceType: "module",
			},
		},
	},
];
