import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: [
		"dist/**",
		"build/**",
		"src/typegen.d.ts",
		"config/**",
		"eslint.config.ts",
		"src/types/eslint-config-types/**",
	],
	typescript: {
		tsconfigPath: "tsconfig.eslint.json",
	},
});
