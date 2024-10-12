import type { OptionsOverrides, OptionsTanstack, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, renameRules } from "@/utils";
import { defaultPluginRenameMap } from "../constants";

const tanstack = async (
	options: OptionsOverrides & OptionsTanstack = {}
): Promise<TypedFlatConfigItem[]> => {
	const { query = true } = options;

	if (query) {
		await ensurePackages(["@tanstack/eslint-plugin-query"]);
	}

	const eslintPluginTanstackQuery = await interopDefault(import("@tanstack/eslint-plugin-query"));

	return [
		{
			name: "zayne/tanstack/setup",
			plugins: {
				"tanstack/query": eslintPluginTanstackQuery,
			},
		},

		{
			name: "zayne/tanstack/query-recommended",
			...renameRules(
				eslintPluginTanstackQuery.configs["flat/recommended"][0]?.rules,
				defaultPluginRenameMap
			),
		},
	];
};

export { tanstack };
