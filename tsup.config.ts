import { type Options, defineConfig } from "tsup";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: true, // generate d.ts
	entry: ["src/index.ts", "src/prettier/index.ts"],
	format: ["esm"],
	platform: "node",
	sourcemap: !isDevMode,
	splitting: true,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.json",
} satisfies Options;

const config = defineConfig({
	...sharedOptions,
	name: "ESM",
	outDir: "./dist",
});

export default config;
