import type { OptionsOverrides, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

const tailwindcss = async (options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> => {
	const eslintPluginTailwindCss = await interopDefault(await import("eslint-plugin-tailwindcss"));

	const { overrides } = options;

	return [
		{
			name: "zayne/tailwindcss/setup",
			plugins: {
				tailwindcss: eslintPluginTailwindCss,
			},
			settings: {
				tailwindcss: {
					callees: ["tv", "cnMerge", "cn", "cnJoin", "twMerge", "twJoin"],
					config: "./tailwind.config.ts",
					cssFiles: [],
					removeDuplicates: false, // Turned off cuz prettier already handles this via plugin
				},
			},
		},

		{
			name: "zayne/tailwindcss/rules",

			rules: {
				...eslintPluginTailwindCss.rules,

				"tailwindcss/no-contradicting-classname": "off", // Turned off cuz tw intellisense already handles this
				"tailwindcss/no-custom-classname": [
					"warn",
					{ ignoredKeys: ["compoundVariants", "defaultVariants", "responsiveVariants"] },
				],

				...overrides,
			},
		},
	];
};

export { tailwindcss };
