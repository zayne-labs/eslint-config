import type {
	OptionsFiles,
	OptionsHasTypeScript,
	OptionsOverrides,
	OptionsReact,
	TypedFlatConfigItem,
} from "@/types";

import { defaultPluginRenameMap } from "@/constants";
import { GLOB_SRC } from "@/globs";
import { ensurePackages, interopDefault, renamePlugins, renameRules } from "@/utils";
import { fixupPluginRules } from "@eslint/compat";
import { isPackageExists } from "local-pkg";

// react refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
const NextJsPackages = ["next"];

const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));

const react = async (
	options: OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsReact = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_SRC], nextjs = isUsingNext, overrides, typescript = true } = options;

	await ensurePackages([
		"@eslint-react/eslint-plugin",
		"eslint-plugin-react-hooks",
		"eslint-plugin-react-refresh",
		...(nextjs ? ["@next/eslint-plugin-next"] : []),
		"typescript-eslint",
	]);

	const [eslintPluginReact, eslintReactHooks, eslintPluginReactRefresh, eslintPluginNextjs] =
		await Promise.all([
			interopDefault(import("@eslint-react/eslint-plugin")),
			interopDefault(import("eslint-plugin-react-hooks")),
			interopDefault(import("eslint-plugin-react-refresh")),
			...(nextjs ? [interopDefault(import("@next/eslint-plugin-next"))] : []),
		] as const);

	// prettier-ignore
	const recommendedReactConfig = eslintPluginReact.configs[typescript ? "recommended-type-checked" : "recommended"];

	const config: TypedFlatConfigItem[] = [
		{
			name: "zayne/react/setup",

			plugins: {
				...renamePlugins(recommendedReactConfig.plugins, defaultPluginRenameMap),
				"react-hooks": fixupPluginRules(eslintReactHooks),
				"react-refresh": eslintPluginReactRefresh,
			},

			settings: recommendedReactConfig.settings,
		},

		{
			files,

			name: "zayne/react/recommended",

			rules: renameRules(recommendedReactConfig.rules, defaultPluginRenameMap),
		},

		{
			files,

			name: "zayne/react/rules",

			rules: {
				// Hook rules
				"react-hooks-extra/ensure-custom-hooks-using-other-hooks": "error",
				"react-hooks-extra/no-unnecessary-use-callback": "warn",
				"react-hooks-extra/no-unnecessary-use-memo": "warn",
				"react-hooks-extra/prefer-use-state-lazy-initialization": "error",
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",
				// Naming convention rules
				"react-naming-convention/component-name": "warn",
				"react-naming-convention/use-state": "warn",
				// React refresh rules
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
				// Regular React rules
				"react/avoid-shorthand-boolean": "error",
				"react/function-component-definition": "off",
				"react/no-array-index-key": "error",
				"react/no-children-count": "off",
				"react/no-children-only": "off",
				"react/no-children-prop": "error",
				"react/no-clone-element": "off",
				"react/no-complex-conditional-rendering": "warn",
				"react/no-missing-component-display-name": "error",
				"react/no-useless-fragment": "error",
				"react/prefer-destructuring-assignment": "error",
				"react/prefer-shorthand-fragment": "error",

				...overrides,
			},
		},
	];

	if (nextjs && eslintPluginNextjs) {
		config.push({
			files,

			name: "zayne/react/next",

			plugins: {
				"nextjs-next": fixupPluginRules(eslintPluginNextjs),
			},

			rules: renameRules(
				/* eslint-disable ts-eslint/no-unsafe-argument, ts-eslint/no-unsafe-member-access */
				{
					// @ts-expect-error - eslint-plugin-nextjs is not typed
					...eslintPluginNextjs.configs?.recommended?.rules,
					// @ts-expect-error - eslint-plugin-nextjs is not typed
					...eslintPluginNextjs.configs?.["core-web-vitals"]?.rules,
				},
				defaultPluginRenameMap
			),
		});
	}

	return config;
};

export { react };
