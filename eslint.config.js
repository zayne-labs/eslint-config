import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	gitignore: false,
	ignores: ["dist/**", "src/typegen.d.ts", "src/types/eslint-config-types/**"],
	react: {
		files: ["fixtures/**"],
		nextjs: true,
		overrides: {
			"nextjs-next/no-html-link-for-pages": ["error", "fixtures"],
		},
	},
	tailwindcss: true,
	tanstack: true,
	type: "lib-strict",
	typescript: {
		tsconfigPath: "tsconfig.eslint.json",
	},
});
