import { interopDefault } from "@/utils";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type {
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	OptionsStylistic,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";

export const typescript = async (
	options: OptionsFiles &
		OptionsComponentExts &
		OptionsOverrides &
		OptionsStylistic &
		OptionsTypeScriptWithTypes &
		OptionsTypeScriptParserOptions = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		allowedDefaultProjects = ["./*.js"],
		componentExts = [],
		files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		overrides,
		parserOptions,
		stylistic = true,
		tsconfigPath,
	} = options;

	const isTypeAware = Boolean(tsconfigPath);

	const tsEslint = await interopDefault(import("typescript-eslint"));

	const makeParser = (parsedFiles: string[], ignores?: string[]): TypedFlatConfigItem => ({
		files: parsedFiles,

		...(ignores && { ignores }),

		languageOptions: {
			parser: tsEslint.parser,

			parserOptions: {
				ecmaFeatures: { globalReturn: true },

				extraFileExtensions: componentExts.map((ext) => `.${ext}`),

				...(isTypeAware && {
					projectService: {
						allowDefaultProject: allowedDefaultProjects,
						defaultProject: tsconfigPath,
					},
					tsconfigRootDir: import.meta.dirname,
				}),

				sourceType: "module",

				...parserOptions,
			},
		},
	});

	const typeAwareRules: TypedFlatConfigItem["rules"] = {
		"ts-eslint/no-unnecessary-type-parameters": "off",
		// "ts-eslint/non-nullable-type-assertion-style": "off",
		"ts-eslint/prefer-nullish-coalescing": ["error", { ignoreConditionalTests: true }],
		"ts-eslint/restrict-template-expressions": [
			"error",
			{ allowBoolean: true, allowNullish: true, allowNumber: true },
		],
		"ts-eslint/return-await": ["error", "in-try-catch"],
	};

	return [
		...tsEslint.configs[isTypeAware ? "strictTypeChecked" : "strict"].map((config) => ({
			...config,
			files,
			name: `zayne/ts-eslint/${isTypeAware ? "strictTypeChecked" : "strict"}`,
		})),

		...(stylistic
			? tsEslint.configs[isTypeAware ? "stylisticTypeChecked" : "stylistic"].map((config) => ({
					...config,
					files,
					name: `zayne/ts-eslint/${isTypeAware ? "stylisticTypeChecked" : "stylistic"}`,
				}))
			: []),

		{
			name: `zayne/ts-eslint/${isTypeAware ? "type-aware-setup" : "setup"}`,

			...makeParser(files),
			...makeParser(filesTypeAware, ignoresTypeAware),
		},

		{
			files,

			name: "zayne/ts-eslint/rules",

			plugins: {
				"ts-eslint": tsEslint.plugin,
			},

			rules: {
				"ts-eslint/array-type": ["error", { default: "array-simple" }],
				"ts-eslint/consistent-type-definitions": ["error", "type"],
				"ts-eslint/default-param-last": "error",
				"ts-eslint/member-ordering": "error",
				"ts-eslint/method-signature-style": ["error", "property"],
				"ts-eslint/no-confusing-void-expression": "off",
				"ts-eslint/no-empty-function": [
					"error",
					{ allow: ["arrowFunctions", "functions", "methods"] },
				],
				"ts-eslint/no-import-type-side-effects": "error",
				"ts-eslint/no-shadow": "error",
				"ts-eslint/no-unused-expressions": [
					"error",
					{
						allowShortCircuit: true,
						allowTernary: true,
					},
				],
				"ts-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
				"ts-eslint/no-use-before-define": "off",
				"ts-eslint/no-useless-constructor": "error",

				...(isTypeAware && typeAwareRules),

				...overrides,
			},
		},
	];
};
