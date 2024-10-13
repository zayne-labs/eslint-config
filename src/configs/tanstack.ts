import type { OptionsOverrides, OptionsTanstack, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, renameRules } from "@/utils";
import { defaultPluginRenameMap } from "../constants";

const tanstack = async (
	options: OptionsOverrides & OptionsTanstack = {}
): Promise<TypedFlatConfigItem[]> => {
	const { query = true } = options;

	const tanstackConfig: TypedFlatConfigItem[] = [
		{
			name: "zayne/tanstack/setup",
			plugins: {
				...(query && {
					"tanstack-query": await interopDefault(import("@tanstack/eslint-plugin-query")),
				}),
			},
		},
	];

	if (query) {
		await ensurePackages(["@tanstack/eslint-plugin-query"]);

		const eslintPluginTanstackQuery = await interopDefault(import("@tanstack/eslint-plugin-query"));

		tanstackConfig.push({
			name: "zayne/tanstack/query-recommended",

			rules: renameRules(
				eslintPluginTanstackQuery.configs["flat/recommended"][0]?.rules,
				defaultPluginRenameMap
			),
		});
	}

	return tanstackConfig;
};

export { tanstack };
