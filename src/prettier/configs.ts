import type { Config } from "prettier";

export const baseConfig = {
	experimentalOperatorPosition: "start",
	jsxSingleQuote: false,
	printWidth: 107,
	singleQuote: false,
	tabWidth: 3,
	trailingComma: "es5",
	useTabs: true,
} satisfies Config;

export const configWithTailwind = {
	...baseConfig,
	customAttributes: ["classNames", "classes"],
	customFunctions: ["cnMerge", "cnJoin", "cn", "tv"],
	endingPosition: "absolute-with-indent",
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
	tailwindAttributes: ["classNames", "classes"],
	tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv"],
} satisfies Config;
