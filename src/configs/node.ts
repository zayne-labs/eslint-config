import { eslintPluginNode } from "@/plugins";
import type { OptionsNode, OptionsOverrides, TypedFlatConfigItem } from "@/types";
import { interopDefault, renameRules } from "@/utils";

export const node = async (
	options: OptionsNode & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, security = false } = options;

	const eslintPluginSecurity = await interopDefault(import("eslint-plugin-security"));

	return [
		{
			name: "zayne/node/setup",
			plugins: {
				node: eslintPluginNode,
				...(security && { security: eslintPluginSecurity }),
			},
		},

		{
			name: "zayne/node/recommended",
			rules: {
				...renameRules(eslintPluginNode.configs["flat/recommended-module"].rules, { n: "node" }),
				...(security && eslintPluginSecurity.configs.recommended.rules),
			},
		},

		{
			name: "zayne/node/rules",

			rules: {
				"node/handle-callback-err": ["error", "^(err|error)$"],
				"node/no-deprecated-api": "error",
				"node/no-exports-assign": "error",
				"node/no-extraneous-import": "off", // eslint-plugin-import-x handles this
				"node/no-missing-import": "off",
				"node/no-new-require": "error",
				"node/no-path-concat": "error",
				"node/no-unpublished-import": "off",
				// "node/prefer-global/buffer": ["error", "never"],
				// "node/prefer-global/process": ["error", "never"],
				"node/process-exit-as-throw": "error",
			},

			...overrides,
		},
	];
};
