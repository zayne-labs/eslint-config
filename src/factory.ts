import { isObject } from "@/utils";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
	comments,
	gitIgnores,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	react,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcss,
	tanstack,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from "./configs";
import { jsx } from "./configs/jsx";
import { defaultPluginRenameMap } from "./constants";
import type { Awaitable, ConfigNames, OptionsConfig, Prettify, TypedFlatConfigItem } from "./types";

const ReactPackages = ["react", "react-dom"];

const VuePackages = ["vue", "nuxt", "vitepress", "@slidev/cli"];

const resolveOptions = (option: unknown) => (isObject(option) ? option : {});

/**
 * Construct an array of ESLint flat config items.
 * @param options
 *  The options for generating the ESLint configurations.
 * @param userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns
 *  The merged ESLint configurations.
 */

export const zayne = (
	options: OptionsConfig & Prettify<Pick<TypedFlatConfigItem, "ignores">> = {},
	userConfigs: Array<
		Awaitable<FlatConfigComposer | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>
	> = []
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
	const {
		/* eslint-disable perfectionist/sort-objects -- I just want to put this at the beginning */
		type = "app",
		autoRenamePlugins = true,
		/* eslint-enable perfectionist/sort-objects -- I just want to put this at the beginning */
		comments: enableComments = true,
		componentExts = [],
		gitignore: enableGitignore = true,
		imports: enableImports = true,
		jsdoc: enableJsdoc = true,
		jsonc: enableJsonc = true,
		jsx: enableJsx = true,
		node: enableNode = true,
		perfectionist: enablePerfectionist = true,
		react: enableReact = ReactPackages.some((pkg) => isPackageExists(pkg)),
		stylistic: enableStylistic = true,
		toml: enableToml = true,
		typescript: enableTypeScript = isPackageExists("typescript"),
		unicorn: enableUnicorn = true,
		vue: enableVue = VuePackages.some((pkg) => isPackageExists(pkg)),
		yaml: enableYaml = true,
		...restOfOptions
	} = options;

	const isStylistic = Boolean(enableStylistic);

	const tsconfigPath =
		isObject(enableTypeScript) && "tsconfigPath" in enableTypeScript
			? enableTypeScript.tsconfigPath
			: null;

	const isTypeAware = Boolean(tsconfigPath);

	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

	// == Base configs
	configs.push(ignores(restOfOptions.ignores), javascript(restOfOptions.javascript));

	if (enableJsx) {
		configs.push(jsx());
	}

	if (enableStylistic) {
		configs.push(stylistic({ jsx: enableJsx, ...resolveOptions(enableStylistic) }));
	}

	if (enableComments) {
		configs.push(comments(resolveOptions(enableComments)));
	}

	if (enableGitignore) {
		configs.push(gitIgnores(resolveOptions(enableGitignore)));
	}

	if (enableImports) {
		configs.push(
			imports({ stylistic: isStylistic, typescript: isTypeAware, ...resolveOptions(enableImports) })
		);
	}

	if (enableNode) {
		configs.push(node({ type, ...resolveOptions(enableNode) }));
	}

	if (enablePerfectionist) {
		configs.push(perfectionist(resolveOptions(enablePerfectionist)));
	}

	if (enableUnicorn) {
		configs.push(unicorn({ type, ...resolveOptions(enableUnicorn) }));
	}

	if (enableJsdoc) {
		configs.push(jsdoc({ stylistic: isStylistic, ...resolveOptions(enableJsdoc) }));
	}

	if (enableJsonc) {
		configs.push(
			jsonc({ stylistic: isStylistic, ...resolveOptions(enableJsonc) }),
			sortPackageJson(),
			sortTsconfig()
		);
	}

	if (enableTypeScript) {
		configs.push(
			typescript({ componentExts, stylistic: isStylistic, ...resolveOptions(enableTypeScript) })
		);
	}

	if (restOfOptions.tailwindcss) {
		configs.push(tailwindcss(resolveOptions(restOfOptions.tailwindcss)));
	}

	if (restOfOptions.tanstack) {
		configs.push(tanstack(resolveOptions(restOfOptions.tanstack)));
	}

	if (enableToml) {
		configs.push(
			toml({
				stylistic: isStylistic,
				...resolveOptions(enableToml),
			})
		);
	}

	if (enableYaml) {
		configs.push(
			yaml({
				stylistic: isStylistic,
				...resolveOptions(enableYaml),
			})
		);
	}

	if (enableReact) {
		configs.push(react({ typescript: isTypeAware, ...resolveOptions(enableReact) }));
	}

	if (enableVue) {
		configs.push(vue({ typescript: isTypeAware, ...resolveOptions(enableVue) }));
	}

	// TODO Switch this out for assert from toolkit later on
	if ("files" in restOfOptions) {
		throw new Error(
			`[@zayne-labs/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second config array instead.`
		);
	}

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

	composer = composer.append(...configs, ...(userConfigs as never[]));

	if (autoRenamePlugins) {
		composer = composer.renamePlugins(defaultPluginRenameMap);
	}

	return composer;
};
