import fs from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { combine, javascript, typescript } from "../src";

const coreRules = () => ({
	plugins: {
		"": { rules: Object.fromEntries(builtinRules) },
	},
});

const configs = await combine(coreRules(), javascript(), typescript());

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
	exportTypeName: "Rules",
});

const configNames = configs.map((config) => config.name).filter(Boolean);

const extraDts = `

// Names of all the configs
export type ConfigNames = ${configNames.map((configName) => `"${configName}"`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", `${dts}${extraDts}`);
