import { interopDefault } from "@/utils";
import { isObject } from "@zayne-labs/toolkit/type-helpers";
import { GLOB_EXCLUDE } from "../globs";
import type { OptionsConfig, TypedFlatConfigItem } from "../types";

export const ignores = (userIgnores: string[] = []): TypedFlatConfigItem[] => [
	{
		ignores: [...GLOB_EXCLUDE, ...userIgnores],
		name: "zayne/defaults/ignores",
	},
];

export const gitIgnores = async (options: OptionsConfig["gitignore"]): Promise<TypedFlatConfigItem[]> => {
	const antfuGitIgnore = await interopDefault(import("eslint-config-flat-gitignore"));

	const config = antfuGitIgnore({
		name: "zayne/gitignore",
		...(isObject(options) ? options : { strict: false }),
	});

	return [config];
};
