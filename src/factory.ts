import { Linter } from "eslint";
import type { FlatESLintConfigItem } from "./types/eslint-config-types";

export type ConfigArray = Array<Linter.Config & FlatESLintConfigItem>;
