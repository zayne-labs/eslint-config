import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	gitignore: false,
	ignores: [
		"dist/**",
		"build/**",
		"src/typegen.d.ts",
		"config/**",
		"eslint.config.ts",
		"src/types/eslint-config-types/**",
	],
	react: true,
	typescript: {
		tsconfigPath: "tsconfig.eslint.json",
	},
});
