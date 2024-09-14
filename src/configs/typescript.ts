import { interopDefault } from "@/utils";
import type { Linter } from "eslint";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type {
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";

export const typescript = async (
	options: OptionsFiles &
		OptionsComponentExts &
		OptionsOverrides &
		OptionsTypeScriptWithTypes &
		OptionsTypeScriptParserOptions = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		componentExts = [],
		files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		overrides,
		parserOptions,
		tsconfigPath,
	} = options;

	const tsEslint = await interopDefault(import("typescript-eslint"));

	const makeParser = (parsedFiles: string[], ignores?: string[]): TypedFlatConfigItem => ({
		files: parsedFiles,

		...(ignores && { ignores }),

		languageOptions: {
			parser: tsEslint.parser as Linter.Parser,

			parserOptions: {
				ecmaFeatures: { globalReturn: true },

				extraFileExtensions: componentExts.map((ext) => `.${ext}`),

				projectService: {
					allowDefaultProject: ["./*.js"],
					defaultProject: tsconfigPath,
				},

				sourceType: "module",

				tsconfigRootDir: import.meta.dirname,

				...parserOptions,
			},
		},
	});

	return [
		...tsEslint.configs.strictTypeChecked.map((config) => ({ ...config, files }) as TypedFlatConfigItem),
		...tsEslint.configs.stylisticTypeChecked.map(
			(config) => ({ ...config, files }) as TypedFlatConfigItem
		),

		{
			name: "zayne/@typescript-eslint/setup",

			...makeParser(files),
			...makeParser(filesTypeAware, ignoresTypeAware),
		},

		{
			files,

			name: "zayne/@typescript-eslint",

			plugins: {
				"@typescript-eslint": tsEslint.plugin,
			},

			rules: {
				"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
				"@typescript-eslint/consistent-type-definitions": ["error", "type"],
				"@typescript-eslint/default-param-last": "error",
				"@typescript-eslint/dot-notation": "error",
				"@typescript-eslint/member-ordering": "error",
				"@typescript-eslint/method-signature-style": ["error", "property"],
				"@typescript-eslint/no-confusing-void-expression": "off",
				"@typescript-eslint/no-empty-function": [
					"error",
					{ allow: ["arrowFunctions", "functions", "methods"] },
				],
				"@typescript-eslint/no-import-type-side-effects": "error",
				"@typescript-eslint/no-shadow": "error",
				"@typescript-eslint/no-unnecessary-type-parameters": "off",
				"@typescript-eslint/no-unused-expressions": [
					"error",
					{
						allowShortCircuit: true,
						allowTernary: true,
					},
				],
				"@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
				"@typescript-eslint/no-use-before-define": "off",
				"@typescript-eslint/no-useless-constructor": "error",
				"@typescript-eslint/non-nullable-type-assertion-style": "off",
				"@typescript-eslint/prefer-nullish-coalescing": ["error", { ignoreConditionalTests: true }],
				"@typescript-eslint/require-await": "error",
				"@typescript-eslint/restrict-template-expressions": [
					"error",
					{ allowBoolean: true, allowNullish: true, allowNumber: true },
				],
				"@typescript-eslint/return-await": ["error", "in-try-catch"],

				...overrides,
			},
		},
	];
};
