import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, TypedFlatConfigItem } from "@/types";

import { GLOB_SRC } from "@/globs";
import { ensurePackages, interopDefault, renamePlugins, renameRules } from "@/utils";
import { fixupPluginRules } from "@eslint/compat";
import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";

// react refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
const NextJsPackages = ["next"];

export const eslintReactRenameMap = {
	"@eslint-react/debug": "react-debug",
	"@eslint-react/dom": "react-dom",
	"@eslint-react/hooks-extra": "react-hooks-extra",
	"@eslint-react/naming-convention": "react-naming-convention",
	"@eslint-react/web-api": "react-web-api",
	// It has to be last to avoid rename issues
	// eslint-disable-next-line perfectionist/sort-objects
	"@eslint-react": "react",
};

const react = async (
	options: OptionsFiles & OptionsHasTypeScript & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files, overrides, typescript = true } = options;

	await ensurePackages([
		"@eslint-react/eslint-plugin",
		"eslint-plugin-react-hooks",
		"eslint-plugin-react-refresh",
		"typescript-eslint",
	]);

	const [eslintPluginReact, eslintReactHooks, eslintPluginReactRefresh] = await Promise.all([
		interopDefault(import("@eslint-react/eslint-plugin")),
		interopDefault(import("eslint-plugin-react-hooks") as ESLint.Plugin),
		interopDefault(import("eslint-plugin-react-refresh") as ESLint.Plugin),
	] as const);

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
	const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
	const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));

	// prettier-ignore
	const recommendedReactConfig = eslintPluginReact.configs[typescript ? "recommended-type-checked" : "recommended"];

	return [
		{
			name: "zayne/react/setup",

			plugins: {
				...renamePlugins(recommendedReactConfig.plugins, eslintReactRenameMap),
				"react-hooks": fixupPluginRules(eslintReactHooks),
				"react-refresh": eslintPluginReactRefresh,
			},

			settings: recommendedReactConfig.settings,
		},

		{
			files: files ?? [GLOB_SRC],

			name: "zayne/react/rules",

			rules: {
				...renameRules(recommendedReactConfig.rules, eslintReactRenameMap),
				"react/avoid-shorthand-boolean": "error",
				"react/function-component-definition": "off",
				"react/no-array-index-key": "error",
				"react/no-children-count": "off",
				"react/no-children-only": "off",
				"react/no-children-prop": "error",
				"react/no-children-to-array": "off",
				"react/no-clone-element": "off",
				"react/no-missing-component-display-name": "error",
				"react/prefer-destructuring-assignment": "error",
				"react/prefer-read-only-props": "off",
				"react/prefer-shorthand-fragment": "error",
				// eslint-disable-next-line perfectionist/sort-objects
				"react-hooks-extra/ensure-custom-hooks-using-other-hooks": "error",
				"react-hooks-extra/prefer-use-state-lazy-initialization": "error",
				"react-naming-convention/component-name": "warn",
				"react-naming-convention/use-state": "warn",

				// Hook rules
				// eslint-disable-next-line perfectionist/sort-objects
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",

				// react refresh
				"react-refresh/only-export-components": [
					"warn",
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(isUsingNext
								? [
										"dynamic",
										"dynamicParams",
										"revalidate",
										"fetchCache",
										"runtime",
										"preferredRegion",
										"maxDuration",
										"config",
										"generateStaticParams",
										"metadata",
										"generateMetadata",
										"viewport",
										"generateViewport",
									]
								: []),
							...(isUsingRemix ? ["meta", "links", "headers", "loader", "action"] : []),
						],
					},
				],

				// overrides
				...overrides,
			},
		},
	];
};

export { react };
