import type { Linter } from "eslint";
import { mergeProcessors } from "eslint-merge-processors";
import { GLOB_VUE } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function vue(
	options: ExtractOptions<OptionsConfig["vue"]> = {}
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_VUE],
		indent = 3,
		overrides,
		stylistic = true,
		typescript = true,
		vueVersion = 3,
	} = options;

	const sfcBlocks = options.sfcBlocks === true ? {} : (options.sfcBlocks ?? {});

	await ensurePackages([
		"eslint-plugin-vue",
		"vue-eslint-parser",
		...(sfcBlocks ? ["eslint-processor-vue-blocks"] : []),
	]);

	const [pluginVue, parserVue, processorVueBlocks] = await Promise.all([
		interopDefault(import("eslint-plugin-vue")),
		interopDefault(import("vue-eslint-parser")),
		interopDefault(import("eslint-processor-vue-blocks")),
	]);

	return [
		{
			// This allows Vue plugin to work with auto imports
			// https://github.com/vuejs/eslint-plugin-vue/pull/2422
			languageOptions: {
				globals: {
					computed: "readonly",
					defineEmits: "readonly",
					defineExpose: "readonly",
					defineProps: "readonly",
					onMounted: "readonly",
					onUnmounted: "readonly",
					reactive: "readonly",
					ref: "readonly",
					shallowReactive: "readonly",
					shallowRef: "readonly",
					toRef: "readonly",
					toRefs: "readonly",
					watch: "readonly",
					watchEffect: "readonly",
				},
			},

			name: "zayne/vue/setup",

			plugins: {
				vue: pluginVue,
			},
		},

		{
			files,

			languageOptions: {
				parser: parserVue,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					extraFileExtensions: [".vue"],
					// eslint-disable-next-line import/no-extraneous-dependencies -- allow this for now, might change later
					parser: typescript ? await interopDefault(import("@typescript-eslint/parser")) : undefined,
					sourceType: "module",
				},
			},

			name: "zayne/vue/rules",

			processor:
				sfcBlocks === false
					? (pluginVue.processors[".vue"] as Linter.Processor)
					: mergeProcessors([
							pluginVue.processors[".vue"] as Linter.Processor,
							processorVueBlocks({
								...sfcBlocks,
								blocks: {
									styles: true,
									...sfcBlocks.blocks,
								},
							}),
						]),

			rules: {
				...pluginVue.configs.base.rules,

				...(vueVersion === 2
					? {
							...pluginVue.configs.essential.rules,
							...pluginVue.configs["strongly-recommended"].rules,
							...pluginVue.configs.recommended.rules,
						}
					: {
							...pluginVue.configs["vue3-essential"].rules,
							...pluginVue.configs["vue3-strongly-recommended"].rules,
							...pluginVue.configs["vue3-recommended"].rules,
						}),

				"node/prefer-global/process": "off",
				"vue/block-order": [
					"error",
					{
						order: ["script", "template", "style"],
					},
				],
				"vue/component-name-in-template-casing": ["error", "PascalCase"],

				"vue/component-options-name-casing": ["error", "PascalCase"],

				// == this is deprecated
				"vue/component-tags-order": "off",

				"vue/custom-event-name-casing": ["error", "camelCase"],
				"vue/define-macros-order": [
					"error",
					{
						order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
					},
				],
				"vue/dot-location": ["error", "property"],
				"vue/dot-notation": ["error", { allowKeywords: true }],
				"vue/eqeqeq": ["error", "smart"],
				"vue/html-indent": ["error", indent],
				"vue/html-quotes": ["error", "double"],
				"vue/max-attributes-per-line": "off",
				"vue/multi-word-component-names": "off",
				"vue/no-dupe-keys": "off",
				"vue/no-empty-pattern": "error",
				"vue/no-irregular-whitespace": "error",
				"vue/no-loss-of-precision": "error",
				"vue/no-restricted-syntax": [
					"error",
					"DebuggerStatement",
					"LabeledStatement",
					"WithStatement",
				],
				"vue/no-restricted-v-bind": ["error", "/^v-/"],
				"vue/no-setup-props-reactivity-loss": "off",
				"vue/no-sparse-arrays": "error",
				"vue/no-unused-refs": "error",
				"vue/no-useless-v-bind": "error",
				"vue/no-v-html": "off",
				"vue/object-shorthand": [
					"error",
					"always",
					{
						avoidQuotes: true,
						ignoreConstructors: false,
					},
				],
				"vue/prefer-separate-static-class": "error",
				"vue/prefer-template": "error",
				"vue/prop-name-casing": ["error", "camelCase"],
				"vue/require-default-prop": "off",
				"vue/require-prop-types": "off",
				"vue/space-infix-ops": "error",
				"vue/space-unary-ops": ["error", { nonwords: false, words: true }],

				...(stylistic && {
					"vue/array-bracket-spacing": ["error", "never"],
					"vue/arrow-spacing": ["error", { after: true, before: true }],
					"vue/block-spacing": ["error", "always"],
					"vue/block-tag-newline": [
						"error",
						{
							multiline: "always",
							singleline: "always",
						},
					],
					"vue/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
					"vue/comma-dangle": ["error", "always-multiline"],
					"vue/comma-spacing": ["error", { after: true, before: false }],
					"vue/comma-style": ["error", "last"],
					"vue/html-comment-content-spacing": [
						"error",
						"always",
						{
							exceptions: ["-"],
						},
					],
					"vue/key-spacing": ["error", { afterColon: true, beforeColon: false }],
					"vue/keyword-spacing": ["error", { after: true, before: true }],
					"vue/object-curly-newline": "off",
					"vue/object-curly-spacing": ["error", "always"],
					"vue/object-property-newline": ["error", { allowMultiplePropertiesPerLine: true }],
					"vue/operator-linebreak": ["error", "before"],
					"vue/padding-line-between-blocks": ["error", "always"],
					"vue/quote-props": ["error", "consistent-as-needed"],
					"vue/space-in-parens": ["error", "never"],
					"vue/template-curly-spacing": "error",
				}),

				...overrides,
			},
		},
	];
}
