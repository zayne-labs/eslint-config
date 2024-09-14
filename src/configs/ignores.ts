import type { TypedFlatConfigItem } from "../types";

import { GLOB_EXCLUDE } from "../globs";

const ignores = (userIgnores: string[] = []): TypedFlatConfigItem[] => [
	{
		ignores: [...GLOB_EXCLUDE, ...userIgnores],
		name: "zayne/defaults/ignores",
	},
];

export { ignores };
