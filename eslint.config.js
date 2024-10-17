import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	gitignore: false,
	ignores: ["dist/**", "src/typegen.d.ts", "src/types/eslint-config-types/**"],
	react: {
		nextjs: true,
	},
	tanstack: true,
	type: "lib",
	typescript: {
		tsconfigPath: "tsconfig.eslint.json",
	},
});
