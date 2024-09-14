import { type Options, defineConfig } from "tsup";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: true, // generate d.ts
	entry: ["src/index.ts"],
	format: ["esm"],
	platform: "browser",
	sourcemap: !isDevMode,
	splitting: true,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.json",
} satisfies Options;

export default defineConfig([
	{
		...sharedOptions,
		name: "ESM",
		outDir: "./dist",
	},
]);
