import { eslintPluginImportX } from "@/plugins";
import type {
	OptionsHasTypeScript,
	OptionsOverrides,
	OptionsStylistic,
	TypedFlatConfigItem,
} from "@/types";

const imports = (
	options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic
): TypedFlatConfigItem[] => {
	const { overrides, stylistic = true, typescript = true } = options;

	return [
		{
			plugins: {
				"import-x": eslintPluginImportX,
			},
			...(typescript && { settings: eslintPluginImportX.flatConfigs.typescript.settings }),
			name: "zayne/import-x/setup",
		},

		{
			name: "zayne/import-x/rules",

			rules: {
				...eslintPluginImportX.flatConfigs.recommended.rules,
				...(typescript && eslintPluginImportX.flatConfigs.typescript.rules),

				"import-x/export": "error",
				"import-x/extensions": [
					"error",
					"never",
					{ ignorePackages: true, pattern: { png: "always", svg: "always" } },
				],
				"import-x/first": "error",
				"import-x/namespace": "off",
				"import-x/no-absolute-path": "error",
				"import-x/no-cycle": ["error", { ignoreExternal: true, maxDepth: 3 }],
				"import-x/no-duplicates": "error",
				"import-x/no-extraneous-dependencies": ["error", { devDependencies: true }],
				"import-x/no-mutable-exports": "error",
				"import-x/no-named-as-default": "error",
				"import-x/no-named-as-default-member": "error",
				"import-x/no-named-default": "error",
				"import-x/no-relative-packages": "error",
				"import-x/no-self-import": "error",
				"import-x/no-unresolved": "off",
				"import-x/no-useless-path-segments": ["error", { commonjs: true }],
				"import-x/prefer-default-export": "off",

				...(stylistic && { "import-x/newline-after-import": "error" }),

				...overrides,
			},
		},
	];
};

export { imports };
