import { isObject } from "@/utils";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
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
	typescript,
	unicorn,
} from "./configs";
import { jsx } from "./configs/jsx";
import { defaultPluginRenameMap } from "./constants";
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from "./types";

const ReactPackages = ["react", "react-dom"];

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
	options: OptionsConfig & Pick<TypedFlatConfigItem, "ignores"> = {},
	userConfigs: Array<
		Awaitable<FlatConfigComposer | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>
	> = []
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
	const {
		autoRenamePlugins = true,
		componentExts = [],
		gitignore: enableGitignore = true,
		jsonc: enableJsonc = true,
		jsx: enableJsx = true,
		node: enableNode = true,
		perfectionist: enablePerfectionist = true,
		react: enableReact = ReactPackages.some((pkg) => isPackageExists(pkg)),
		stylistic: enableStylistic = true,
		type = "app",
		typescript: enableTypeScript = isPackageExists("typescript"),
		unicorn: enableUnicorn = true,
		...restOfOptions
	} = options;

	const isStylistic = Boolean(enableStylistic);

	const tsconfigPath =
		isObject(enableTypeScript) && "tsconfigPath" in enableTypeScript
			? enableTypeScript.tsconfigPath
			: null;

	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

	if (enableGitignore) {
		configs.push(gitIgnores(resolveOptions(enableGitignore)));
	}

	// Base configs
	configs.push(
		ignores(restOfOptions.ignores),
		javascript(restOfOptions.javascript),
		imports({ stylistic: isStylistic }),
		jsdoc({ stylistic: isStylistic })
	);

	if (enableNode) {
		configs.push(node({ type, ...resolveOptions(enableNode) }));
	}

	if (enablePerfectionist) {
		configs.push(perfectionist(resolveOptions(enablePerfectionist)));
	}

	if (enableUnicorn) {
		configs.push(unicorn({ type, ...resolveOptions(enableUnicorn) }));
	}

	if (enableJsonc) {
		configs.push(
			jsonc({
				stylistic: isStylistic,
				...resolveOptions(enableJsonc),
			}),
			sortPackageJson(),
			sortTsconfig()
		);
	}

	if (enableTypeScript) {
		configs.push(
			typescript({
				componentExts,
				stylistic: isStylistic,
				...resolveOptions(enableTypeScript),
			})
		);
	}

	if (restOfOptions.tailwindcss) {
		configs.push(tailwindcss(resolveOptions(restOfOptions.tailwindcss)));
	}

	if (restOfOptions.tanstack) {
		configs.push(tanstack(resolveOptions(restOfOptions.tanstack)));
	}

	if (enableJsx) {
		configs.push(jsx());
	}

	if (enableStylistic) {
		const stylisticOptions = resolveOptions(enableStylistic);

		configs.push(
			stylistic({
				...stylisticOptions,
				...(!("jsx" in stylisticOptions) && { jsx: enableJsx }),
			})
		);
	}

	if (enableReact) {
		configs.push(
			react({
				...resolveOptions(enableReact),
				typescript: Boolean(tsconfigPath),
			})
		);
	}

	if ("files" in restOfOptions) {
		throw new Error(
			'[@zayne-labs/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second config array instead.'
		);
	}

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

	composer = composer.append(...configs, ...(userConfigs as never[]));

	if (autoRenamePlugins) {
		composer = composer.renamePlugins(defaultPluginRenameMap);
	}

	return composer;
};
