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
				import: eslintPluginImportX,
			},
			...(typescript && { settings: eslintPluginImportX.flatConfigs.typescript.settings }),
			name: "zayne/import/setup",
		},

		{
			name: "zayne/import/rules",

			rules: {
				...eslintPluginImportX.flatConfigs.recommended.rules,
				...(typescript && eslintPluginImportX.flatConfigs.typescript.rules),

				"import/export": "error",
				"import/extensions": [
					"error",
					"never",
					{ ignorePackages: true, pattern: { png: "always", svg: "always" } },
				],
				"import/first": "error",
				"import/namespace": "off",
				"import/no-absolute-path": "error",
				"import/no-cycle": ["error", { ignoreExternal: true, maxDepth: 3 }],
				"import/no-duplicates": "error",
				"import/no-extraneous-dependencies": ["error", { devDependencies: true }],
				"import/no-mutable-exports": "error",
				"import/no-named-as-default": "error",
				"import/no-named-as-default-member": "error",
				"import/no-named-default": "error",
				"import/no-relative-packages": "error",
				"import/no-self-import": "error",
				"import/no-unresolved": "off",
				"import/no-useless-path-segments": ["error", { commonjs: true }],
				"import/prefer-default-export": "off",

				...(stylistic && { "import/newline-after-import": "error" }),

				...overrides,
			},
		},
	];
};

export { imports };
