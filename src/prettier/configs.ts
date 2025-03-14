import type { AnyString } from "@zayne-labs/toolkit-type-helpers";
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

export type ConfigWithTailwind = Omit<Config, "plugins"> & {
	plugins?: Array<
		// eslint-disable-next-line perfectionist/sort-union-types -- prettier-plugin-tailwindcss should come before prettier-plugin-classnames
		"prettier-plugin-tailwindcss" | "prettier-plugin-classnames" | "prettier-plugin-merge" | AnyString
	>;
	tailwindAttributes?: string[];
	tailwindConfig?: `./${string}`;
	tailwindFunctions?: string[];
	tailwindPreserveDuplicates?: boolean;
	tailwindPreserveWhitespace?: boolean;
	tailwindStylesheet?: `./${string}`;
};

export const configWithTailwind = {
	...baseConfig,
	endingPosition: "absolute-with-indent",
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
	tailwindAttributes: ["classNames", "classes"],
	tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv"],
	tailwindStylesheet: "./tailwind.css",
} satisfies ConfigWithTailwind;
