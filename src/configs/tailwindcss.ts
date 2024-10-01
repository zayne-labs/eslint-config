import type { OptionsOverrides, OptionsTailwindCSS, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

const tailwindcss = async (
	options: OptionsOverrides & OptionsTailwindCSS = {}
): Promise<TypedFlatConfigItem[]> => {
	const eslintPluginTailwindCss = await interopDefault(await import("eslint-plugin-tailwindcss"));

	const { overrides, settings: tailwindCssSettings } = options;

	await ensurePackages(["eslint-plugin-tailwindcss"]);

	return [
		{
			name: "zayne/tailwindcss/setup",
			plugins: {
				tailwindcss: eslintPluginTailwindCss,
			},
			settings: {
				tailwindcss: {
					callees: ["tv", "cnMerge", "cn", "cnJoin", "twMerge", "twJoin"],
					cssFiles: [],
					removeDuplicates: false, // Turned off cuz prettier already handles this via plugin
					...tailwindCssSettings,
				},
			},
		},

		{
			name: "zayne/tailwindcss/rules",

			rules: {
				...eslintPluginTailwindCss.configs["flat/recommended"][1]?.rules,

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
