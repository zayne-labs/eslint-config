import { fileURLToPath } from "node:url";
import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";
import type { Awaitable, TypedFlatConfigItem } from "./types";

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

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition
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

export const isObject = (value: unknown) => typeof value === "object" && value !== null;

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

const scopeUrl = fileURLToPath(new URL(".", import.meta.url));
const isCwdInScope = isPackageExists("@zayne-labs/eslint-config");

export const isPackageInScope = (name: string): boolean => isPackageExists(name, { paths: [scopeUrl] });

export const ensurePackages = async (packages: Array<string | undefined>): Promise<void> => {
	if (process.env.CI || !process.stdout.isTTY || !isCwdInScope) return;

	const nonExistingPackages = packages.filter((pkg) => pkg && !isPackageInScope(pkg)) as string[];

	if (nonExistingPackages.length === 0) return;

	const clackPrompt = await import("@clack/prompts");

	const result = await clackPrompt.confirm({
		message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
	});

	if (result) {
		const antfuPkg = await import("@antfu/install-pkg");

		await antfuPkg.installPackage(nonExistingPackages, { dev: true });
	}
};

// export const toArray = <TValue>(value: TValue | TValue[]): TValue[] => {
// 	return Array.isArray(value) ? value : [value];
// };
