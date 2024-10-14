import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { Rules } from "../typegen";
import type { FlatESLintConfigItem } from "./eslint-config-types";

export type Awaitable<T> = Promise<T> | T;

export type { ConfigNames, Rules } from "../typegen";

/* eslint-disable ts-eslint/consistent-type-definitions */
export interface TypedFlatConfigItem extends FlatESLintConfigItem<Partial<Linter.RulesRecord> & Rules> {
	// Relax plugins type limitation, as most of the plugins did not have correct type info yet.

	// eslint-disable-next-line ts-eslint/no-explicit-any
	plugins?: Record<string, any>;
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
}
export interface OptionsAppType {
	type?: "app" | "lib";
}

export interface OptionsFiles {
	/**
	 * Override the `files` option to provide custom globs.
	 */
	files?: string[];
}

export interface OptionsVue extends OptionsOverrides {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default true
	 */
	// sfcBlocks?: boolean | VueBlocksOptions;

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`.
	 * @default 3
	 */
	vueVersion?: 2 | 3;
}

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
	/**
	 *	Default projects to allow in the parser project service.
	 * Ensure you don't use more than 8 defaultProjects.
	 */
	allowDefaultProjects?: [string?, string?, string?, string?, string?, string?, string?, string?];

	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];

	/**
	 * Glob patterns for files that should not be type aware.
	 * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
	 */
	ignoresTypeAware?: string[];

	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>;
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: true | string | string[];
}

export type OptionsTypescript =
	| (OptionsOverrides & OptionsTypeScriptParserOptions)
	| (OptionsOverrides & OptionsTypeScriptWithTypes);

export interface OptionsHasTypeScript {
	typescript?: boolean;
}

export interface OptionsStylistic {
	stylistic?: boolean;
}

export interface OptionsTanstack {
	/**
	 *  Enable tanstack query linting
	 */
	query?: boolean;
}

export interface OptionsHasJsx {
	jsx?: boolean;
}

export interface OptionsTailwindCSS {
	settings?: {
		callees: string[];
		classRegex: string;
		config: string;
		cssFiles: string[];
		cssFilesRefreshRate: number;
		removeDuplicates: boolean;
		skipClassAttribute: boolean;
		tags: string[];
		whitelist: string[];
	};
}

export interface OptionsRegExp {
	/**
	 * Override rule levels
	 */
	level?: "error" | "warn";
}

export interface OptionsNode {
	/**
	 *  Enable eslint-plugin-security
	 * @default false
	 */
	security?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
	/**
	 * Enable ASTRO support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * Requires installing for formatting .astro:
	 * - `prettier-plugin-astro`
	 * @default false
	 */
	astro?: boolean | OptionsOverrides;

	/**
	 * Automatically rename plugins in the config.
	 * @default true
	 */
	autoRenamePlugins?: boolean;

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 * @default true
	 */
	gitignore?: boolean | FlatGitignoreOptions;

	/**
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsOverrides;

	/**
	 * Enable JSONC support.
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides;

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * @default true
	 */
	markdown?: boolean | OptionsOverrides;

	/**
	 * Enable linting for node.
	 *
	 * @default true
	 */
	node?: (OptionsNode & OptionsOverrides) | boolean;

	/**
	 * Enable `perfectionist` rules.
	 * @default true
	 */
	perfectionist?: boolean | OptionsOverrides;

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 * @default auto-detect based on the dependencies
	 */
	react?: boolean | OptionsOverrides;

	/**
	 * Enable regexp rules.
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: (OptionsOverrides & OptionsRegExp) | boolean;

	/**
	 * Enable solid rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-solid`
	 * @default false
	 */
	solid?: boolean | OptionsOverrides;

	/**
	 * Enable stylistic rules.
	 * @see https://eslint.style/
	 * @default true
	 */
	stylistic?: (OptionsHasJsx & OptionsOverrides) | boolean;

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 * @default false
	 */
	svelte?: boolean;

	/**
	 * Enable TailwindCSS support.
	 */
	tailwindcss?: (OptionsOverrides & OptionsTailwindCSS) | boolean;

	/**
	 * Enable TanStack Query support.
	 *
	 * Might require installing the following:
	 * - @tanstack/eslint-plugin-query
	 */
	tanstack?: (OptionsOverrides & OptionsTanstack) | boolean;

	/**
	 * Enable TOML support.
	 * @default true
	 */
	toml?: boolean | OptionsOverrides;

	/**
	 * Specifiy application type
	 */
	type?: OptionsAppType["type"];

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 * @default auto-detect based on the dependencies
	 */
	typescript?: (OptionsStylistic & OptionsTypescript) | boolean;

	/**
	 * Options for eslint-plugin-unicorn.
	 * @default true
	 */
	unicorn?: boolean | OptionsOverrides;

	/**
	 * Enable Vue support.
	 */
	vue?: boolean | OptionsVue;

	/**
	 * Enable YAML support.
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides;
}
