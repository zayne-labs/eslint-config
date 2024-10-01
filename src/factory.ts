import { isObject } from "@zayne-labs/toolkit/type-helpers";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
	eslintReactRenameMap,
	gitIgnores,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	perfectionist,
	react,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcss,
	typescript,
	unicorn,
} from "./configs";
import { jsx } from "./configs/jsx";
import type {
	Awaitable,
	ConfigNames,
	OptionsConfig,
	OptionsOverrides,
	TypedFlatConfigItem,
} from "./types";

const getOverrides = (option: boolean | OptionsOverrides | undefined) => {
	// eslint-disable-next-line ts-eslint/no-explicit-any
	return isObject<Record<string, any>>(option) ? option.overrides : {};
};

const ReactPackages = ["react", "react-dom", "next", "remix"];

export const defaultPluginRenaming = {
	...eslintReactRenameMap,
	"@stylistic": "stylistic",
	"@typescript-eslint": "ts-eslint",
	"import-x": "import",
	n: "node",
};

/**
 * Construct an array of ESLint flat config items.
 * @param options
 *  The options for generating the ESLint configurations.
 * @param userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns
 *  The merged ESLint configurations.
 */

// eslint-disable-next-line complexity
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
		perfectionist: enablePerfectionist = true,
		react: enableReact = ReactPackages.some((pkg) => isPackageExists(pkg)),
		stylistic: enableStylistic = true,
		tailwindcss: enableTailwindCSS = isPackageExists("tailwindcss"),
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
		configs.push(gitIgnores(enableGitignore));
	}

	// Base configs
	configs.push(
		ignores(restOfOptions.ignores),
		javascript(restOfOptions.javascript),
		imports({ stylistic: isStylistic }),
		jsdoc({ stylistic: isStylistic })
	);

	if (enablePerfectionist) {
		configs.push(perfectionist({ overrides: getOverrides(enablePerfectionist) }));
	}

	if (enableUnicorn) {
		configs.push(unicorn({ overrides: getOverrides(enableUnicorn) }));
	}

	if (enableJsonc) {
		configs.push(
			jsonc({
				overrides: getOverrides(enableJsonc),
				stylistic: isStylistic,
			}),
			sortPackageJson(),
			sortTsconfig()
		);
	}

	if (enableTypeScript) {
		configs.push(
			typescript({
				...(isObject(enableTypeScript) && enableTypeScript),
				componentExts,
				overrides: getOverrides(enableTypeScript),
				stylistic: true,
			})
		);
	}

	if (enableJsx) {
		configs.push(jsx());
	}

	if (enableStylistic) {
		const stylisticOptions = isObject(enableStylistic) ? enableStylistic : {};

		!Object.hasOwn(stylisticOptions, "jsx") && (stylisticOptions.jsx = enableJsx);

		configs.push(stylistic(stylisticOptions));
	}

	if (enableTailwindCSS) {
		configs.push(tailwindcss({ ...(isObject(enableTailwindCSS) && enableTailwindCSS) }));
	}

	if (enableReact) {
		configs.push(
			react({
				overrides: getOverrides(enableReact),
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
		composer = composer.renamePlugins(defaultPluginRenaming);
	}

	return composer;
};
