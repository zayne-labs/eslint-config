import type { ESLint } from "eslint";
import type { Awaitable, TypedFlatConfigItem } from "./types";

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/**
 * Combine array and non-array configs into a single array.
 */
export const combine = async (
	...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
) => {
	const resolved = await Promise.all(configs);

	return resolved.flat();
};

export const interopDefault = async <TModule>(
	module: Awaitable<TModule>
): Promise<TModule extends { default: infer TDefaultExport } ? TDefaultExport : TModule> => {
	const resolved = await module;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return (resolved as { default: never }).default ?? resolved;
};

export const renameRules = (rules: Record<string, unknown>, renameMap: Record<string, string>) => {
	const renamedRulesEntries = Object.entries(rules).map(([ruleKey, ruleValue]) => {
		for (const [oldRuleName, newRuleName] of Object.entries(renameMap)) {
			if (ruleKey.startsWith(`${oldRuleName}/`)) {
				return [`${newRuleName}${ruleKey.slice(oldRuleName.length)}`, ruleValue];
			}
		}

		return [ruleKey, ruleValue];
	});

	const renamedRules = Object.fromEntries(renamedRulesEntries) as TypedFlatConfigItem["rules"];

	return renamedRules;
};

export const renamePlugins = (plugins: Record<string, unknown>, renameMap: Record<string, string>) => {
	const renamedPluginEntries = Object.entries(plugins).map(([pluginKey, pluginValue]) => {
		if (pluginKey in renameMap) {
			return [renameMap[pluginKey], pluginValue];
		}

		return [pluginKey, pluginValue];
	});

	const renamedPlugins = Object.fromEntries(renamedPluginEntries) as Record<string, ESLint.Plugin>;

	return renamedPlugins;
};

const isObject = (value: unknown) => typeof value === "object" && value !== null;

export const renamePluginInConfigs = (
	configs: TypedFlatConfigItem[],
	renameMap: Record<string, string>,
	extraOverrides?: TypedFlatConfigItem
): TypedFlatConfigItem[] => {
	const renamedConfigs = configs.map((config) => ({
		...config,
		...extraOverrides,
		...(isObject(config.rules) && { rules: renameRules(config.rules, renameMap) }),
		...(isObject(config.plugins) && { plugins: renamePlugins(config.plugins, renameMap) }),
	}));

	return renamedConfigs;
};
