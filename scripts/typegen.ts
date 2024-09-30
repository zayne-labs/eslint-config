import fs from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import {
	combine,
	javascript,
	jsdoc,
	jsonc,
	perfectionist,
	react,
	stylistic,
	tailwindcss,
	typescript,
	unicorn,
} from "../src";

const coreRules = () => ({
	// eslint-disable-next-line ts-eslint/no-deprecated
	plugins: { "": { rules: Object.fromEntries(builtinRules) } },
});

const configs = await combine(
	coreRules(),
	javascript(),
	unicorn(),
	typescript(),
	tailwindcss(),
	perfectionist(),
	stylistic(),
	jsdoc(),
	jsonc(),
	react()
);

const dts = await flatConfigsToRulesDTS(configs, {
	exportTypeName: "Rules",
	includeAugmentation: false,
});

const configNames = configs.map((config) => config.name).filter(Boolean);

const extraDts = `

// Names of all the configs
export type ConfigNames = ${configNames.map((configName) => `"${configName}"`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", `${dts}${extraDts}`);
