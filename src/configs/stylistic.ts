import { GLOB_YAML } from "@/globs";
import type { OptionsHasJsx, OptionsOverrides, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

const stylistic = async (
	options: OptionsHasJsx & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> => {
	const { jsx = true, overrides } = options;
	const eslintPluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));

	return [
		// == Stylistic Rules (Optional)
		{
			name: "zayne/stylistic/rules",

			plugins: {
				stylistic: eslintPluginStylistic,
			},

			rules: {
				"stylistic/no-floating-decimal": "error",
				"stylistic/spaced-comment": [
					"warn",
					"always",
					{
						block: {
							balanced: true,
							exceptions: ["*"],
							markers: ["!"],
						},
						line: {
							exceptions: ["/", "#"],
							markers: ["/"],
						},
					},
				],

				...(jsx && {
					"stylistic/jsx-self-closing-comp": "error",
				}),

				...overrides,
			},
		},
		{
			files: [GLOB_YAML],

			rules: {
				"stylistic/spaced-comment": "off",
			},
		},
	];
};

export { stylistic };
