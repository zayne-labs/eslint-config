import { interopDefault } from "@/utils";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

export const unicorn = async (options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> => {
	const { overrides } = options;

	const eslintPluginUnicorn = await interopDefault(import("eslint-plugin-unicorn"));

	return [
		{ ...eslintPluginUnicorn.configs["flat/recommended"], name: "zayne/unicorn/recommended" },
		{
			name: "zayne/unicorn/rules",
			rules: {
				"unicorn/filename-case": [
					"warn",
					{
						cases: {
							camelCase: true,
							kebabCase: true,
							pascalCase: true,
						},
					},
				],
				"unicorn/new-for-builtins": "off",
				"unicorn/no-array-for-each": "off",
				"unicorn/no-array-reduce": "off",
				"unicorn/no-negated-condition": "off",
				"unicorn/no-null": "off",
				"unicorn/no-useless-undefined": ["error", { checkArguments: true }],
				"unicorn/numeric-separators-style": "off",
				"unicorn/prevent-abbreviations": "off",

				...overrides,
			},
		},
	];
};
