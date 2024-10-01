import { fileURLToPath } from 'node:url';
import { isObject } from '@zayne-labs/toolkit/type-helpers';
import { isPackageExists } from 'local-pkg';
import default2 from '@eslint/js';
import default3 from 'eslint-plugin-import-x';
import globals from 'globals';
import { fixupPluginRules } from '@eslint/compat';
import { FlatConfigComposer } from 'eslint-flat-config-utils';

// src/utils.ts
var combine = async (...configs) => {
  const resolved = await Promise.all(configs);
  return resolved.flat();
};
var interopDefault = async (module) => {
  const resolved = await module;
  return resolved.default ?? resolved;
};
var renameRules = (rules, renameMap) => {
  const renamedRulesEntries = Object.entries(rules).map(([ruleKey, ruleValue]) => {
    for (const [oldRuleName, newRuleName] of Object.entries(renameMap)) {
      if (ruleKey.startsWith(`${oldRuleName}/`)) {
        return [`${newRuleName}${ruleKey.slice(oldRuleName.length)}`, ruleValue];
      }
    }
    return [ruleKey, ruleValue];
  });
  const renamedRules = Object.fromEntries(renamedRulesEntries);
  return renamedRules;
};
var renamePlugins = (plugins, renameMap) => {
  const renamedPluginEntries = Object.entries(plugins).map(([pluginKey, pluginValue]) => {
    if (pluginKey in renameMap) {
      return [renameMap[pluginKey], pluginValue];
    }
    return [pluginKey, pluginValue];
  });
  const renamedPlugins = Object.fromEntries(renamedPluginEntries);
  return renamedPlugins;
};
var renamePluginInConfigs = (configs, renameMap, extraOverrides) => {
  const renamedConfigs = configs.map((config) => ({
    ...config,
    ...extraOverrides,
    ...isObject(config.rules) && { rules: renameRules(config.rules, renameMap) },
    ...isObject(config.plugins) && { plugins: renamePlugins(config.plugins, renameMap) }
  }));
  return renamedConfigs;
};
var scopeUrl = fileURLToPath(new URL(".", import.meta.url));
var isCwdInScope = isPackageExists("@zayne-labs/eslint-config");
var isPackageInScope = (name) => isPackageExists(name, { paths: [scopeUrl] });
var ensurePackages = async (packages) => {
  if (process.env.CI || !process.stdout.isTTY || !isCwdInScope) return;
  const nonExistingPackages = packages.filter((pkg) => pkg && !isPackageInScope(pkg));
  if (nonExistingPackages.length === 0) return;
  const clackPrompt = await import('@clack/prompts');
  const result = await clackPrompt.confirm({
    message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`
  });
  if (result) {
    const antfuPkg = await import('@antfu/install-pkg');
    await antfuPkg.installPackage(nonExistingPackages, { dev: true });
  }
};

// src/globs.ts
var GLOB_SRC_EXT = "?([cm])[jt]s?(x)";
var GLOB_SRC = "**/*.?([cm])[jt]s?(x)";
var GLOB_JS = "**/*.?([cm])js";
var GLOB_JSX = "**/*.?([cm])jsx";
var GLOB_TS = "**/*.?([cm])ts";
var GLOB_TSX = "**/*.?([cm])tsx";
var GLOB_STYLES = "**/*.{c,le,sc}ss";
var GLOB_CSS = "**/*.css";
var GLOB_POSTCSS = "**/*.{p,post}css";
var GLOB_LESS = "**/*.less";
var GLOB_SCSS = "**/*.scss";
var GLOB_JSON = "**/*.json";
var GLOB_JSON5 = "**/*.json5";
var GLOB_JSONC = "**/*.jsonc";
var GLOB_MARKDOWN = "**/*.md";
var GLOB_MARKDOWN_IN_MARKDOWN = "**/*.md/*.md";
var GLOB_SVELTE = "**/*.svelte";
var GLOB_VUE = "**/*.vue";
var GLOB_YAML = "**/*.y?(a)ml";
var GLOB_TOML = "**/*.toml";
var GLOB_XML = "**/*.xml";
var GLOB_SVG = "**/*.svg";
var GLOB_HTML = "**/*.htm?(l)";
var GLOB_ASTRO = "**/*.astro";
var GLOB_ASTRO_TS = "**/*.astro/*.ts";
var GLOB_GRAPHQL = "**/*.{g,graph}ql";
var GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`;
var GLOB_TESTS = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`,
  `**/*.bench.${GLOB_SRC_EXT}`,
  `**/*.benchmark.${GLOB_SRC_EXT}`
];
var GLOB_ALL_SRC = [
  GLOB_SRC,
  GLOB_STYLES,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_MARKDOWN,
  GLOB_SVELTE,
  GLOB_VUE,
  GLOB_YAML,
  GLOB_XML,
  GLOB_HTML
];
var GLOB_EXCLUDE = [
  "**/node_modules",
  "**/dist",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb",
  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.svelte-kit",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.output",
  "**/.vite-inspect",
  "**/.yarn",
  "**/vite.config.*.timestamp-*",
  "**/CHANGELOG*.md",
  "**/*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts"
];

// src/configs/ignores.ts
var ignores = (userIgnores = []) => [
  {
    ignores: [...GLOB_EXCLUDE, ...userIgnores],
    name: "zayne/defaults/ignores"
  }
];
var gitIgnores = async (options) => {
  const antfuGitIgnore = await interopDefault(import('eslint-config-flat-gitignore'));
  const config = antfuGitIgnore({
    name: "zayne/gitignore",
    strict: false,
    ...options
  });
  return [config];
};
var javascript = (options = {}) => {
  const { overrides } = options;
  return [
    {
      languageOptions: {
        ecmaVersion: "latest",
        globals: {
          ...globals.browser,
          ...globals.node,
          document: "readonly",
          navigator: "readonly",
          window: "readonly"
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: "latest",
          sourceType: "module"
        },
        sourceType: "module"
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      },
      name: "zayne/js-eslint/setup"
    },
    {
      name: "zayne/js-eslint/recommended",
      ...default2.configs.recommended
    },
    {
      name: "zayne/js-eslint/rules",
      rules: {
        "accessor-pairs": ["error", { enforceForClassMembers: true, setWithoutGet: true }],
        "array-callback-return": ["error", { allowImplicit: true }],
        "block-scoped-var": "error",
        "class-methods-use-this": "error",
        complexity: ["warn", 30],
        "constructor-super": "error",
        curly: ["error", "multi-line"],
        "default-case": ["error", { commentPattern: "^no default$" }],
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-notation": ["error", { allowKeywords: true }],
        eqeqeq: ["error", "always", { null: "ignore" }],
        "grouped-accessor-pairs": "error",
        "logical-assignment-operators": "warn",
        "max-depth": ["error", 2],
        "new-cap": ["error", { capIsNew: false, newIsCap: true, properties: true }],
        "no-alert": "warn",
        "no-array-constructor": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": ["error", "always"],
        "no-console": ["error", { allow: ["warn", "error", "info", "trace"] }],
        "no-const-assign": "error",
        "no-constant-condition": "warn",
        "no-constructor-return": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-delete-var": "error",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-eval": "error",
        "no-ex-assign": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": "warn",
        "no-implied-eval": "error",
        "no-import-assign": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-iterator": "error",
        "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-loss-of-precision": "error",
        "no-misleading-character-class": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-native-nonconstructor": "error",
        "no-new-wrappers": "error",
        "no-obj-calls": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-param-reassign": [
          "error",
          {
            ignorePropertyModificationsFor: [
              "acc",
              // for reduce accumulators
              "accumulator",
              // for reduce accumulators
              "e",
              // for e.returnvalue
              "ctx",
              // for Koa routing
              "context",
              // for Koa routing
              "req",
              // for Express requests
              "request",
              // for Express requests
              "res",
              // for Express responses
              "response",
              // for Express responses
              "$scope",
              // for Angular 1 scopes
              "staticContext"
              // for ReactRouter context
            ],
            props: true
          }
        ],
        "no-proto": "error",
        "no-prototype-builtins": "error",
        "no-redeclare": ["error", { builtinGlobals: false }],
        "no-regex-spaces": "error",
        "no-restricted-exports": [
          "error",
          {
            restrictedNamedExports: [
              "default",
              // use `export default` to provide a default export
              "then"
              // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
            ]
          }
        ],
        "no-restricted-globals": [
          "error",
          {
            message: "Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite",
            name: "isFinite"
          },
          {
            message: "Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan",
            name: "isNaN"
          },
          { message: "Use `globalThis` instead.", name: "global" },
          { message: "Use `globalThis` instead.", name: "self" }
        ],
        "no-restricted-imports": ["off", { paths: [], patterns: [] }],
        "no-restricted-properties": [
          "error",
          {
            message: "arguments.callee is deprecated",
            object: "arguments",
            property: "callee"
          },
          {
            message: "Please use Number.isFinite instead",
            object: "global",
            property: "isFinite"
          },
          {
            message: "Please use Number.isFinite instead",
            object: "self",
            property: "isFinite"
          },
          {
            message: "Please use Number.isFinite instead",
            object: "window",
            property: "isFinite"
          },
          {
            message: "Please use Number.isNaN instead",
            object: "global",
            property: "isNaN"
          },
          {
            message: "Please use Number.isNaN instead",
            object: "self",
            property: "isNaN"
          },
          {
            message: "Please use Number.isNaN instead",
            object: "window",
            property: "isNaN"
          },
          {
            message: "Use the exponentiation operator (**) instead.",
            object: "Math",
            property: "pow"
          },
          {
            message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
            property: "__proto__"
          },
          { message: "Use `Object.defineProperty` instead.", property: "__defineGetter__" },
          { message: "Use `Object.defineProperty` instead.", property: "__defineSetter__" },
          { message: "Use `Object.getOwnPropertyDescriptor` instead.", property: "__lookupGetter__" },
          { message: "Use `Object.getOwnPropertyDescriptor` instead.", property: "__lookupSetter__" }
        ],
        "no-restricted-syntax": [
          "error",
          "ForInStatement",
          "LabeledStatement",
          "WithStatement",
          "TSEnumDeclaration[const=true]",
          "TSExportAssignment"
        ],
        "no-return-assign": ["error", "except-parens"],
        "no-script-url": "error",
        "no-self-assign": ["error", { props: true }],
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow-restricted-names": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-throw-literal": "error",
        "no-undef": "error",
        "no-undef-init": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": ["warn", { defaultAssignment: false }],
        "no-unreachable": "error",
        "no-unreachable-loop": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        "no-unused-vars": [
          "warn",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all"
          }
        ],
        // "no-use-before-define": ["error", { classes: false, functions: false, variables: true }],
        "no-useless-backreference": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": [
          "error",
          { ignoreDestructuring: false, ignoreExport: false, ignoreImport: false }
        ],
        "no-useless-return": "error",
        "no-var": "error",
        "no-with": "error",
        "object-shorthand": ["error", "always", { avoidQuotes: true, ignoreConstructors: false }],
        "one-var": ["error", { initialized: "never" }],
        "operator-assignment": "warn",
        "prefer-arrow-callback": [
          "error",
          {
            allowNamedFunctions: false,
            allowUnboundThis: true
          }
        ],
        "prefer-const": [
          "error",
          {
            destructuring: "all",
            ignoreReadBeforeAssign: true
          }
        ],
        "prefer-exponentiation-operator": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "warn",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        radix: "error",
        "symbol-description": "error",
        "unicode-bom": ["error", "never"],
        "use-isnan": ["error", { enforceForIndexOf: true, enforceForSwitchCase: true }],
        "valid-typeof": ["error", { requireStringLiterals: true }],
        "vars-on-top": "error",
        yoda: ["error", "never"],
        ...overrides
      }
    }
  ];
};

// src/configs/tailwindcss.ts
var tailwindcss = async (options = {}) => {
  const eslintPluginTailwindCss = await interopDefault(await import('eslint-plugin-tailwindcss'));
  const { overrides, settings: tailwindCssSettings } = options;
  await ensurePackages(["eslint-plugin-tailwindcss"]);
  return [
    {
      name: "zayne/tailwindcss/setup",
      plugins: {
        tailwindcss: eslintPluginTailwindCss
      },
      settings: {
        tailwindcss: {
          callees: ["tv", "cnMerge", "cn", "cnJoin", "twMerge", "twJoin"],
          cssFiles: [],
          removeDuplicates: false,
          // Turned off cuz prettier already handles this via plugin
          ...tailwindCssSettings
        }
      }
    },
    {
      name: "zayne/tailwindcss/rules",
      rules: {
        ...eslintPluginTailwindCss.configs["flat/recommended"][1]?.rules,
        "tailwindcss/no-contradicting-classname": "off",
        // Turned off cuz tw intellisense already handles this
        "tailwindcss/no-custom-classname": [
          "warn",
          { ignoredKeys: ["compoundVariants", "defaultVariants", "responsiveVariants"] }
        ],
        ...overrides
      }
    }
  ];
};

// src/configs/typescript.ts
var typescript = async (options = {}) => {
  const {
    allowDefaultProjects,
    componentExts = [],
    files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
    overrides,
    parserOptions,
    stylistic: stylistic2 = true,
    tsconfigPath
  } = options;
  const isTypeAware = Boolean(tsconfigPath);
  const tsEslint = await interopDefault(import('typescript-eslint'));
  const makeParser = (parsedFiles, ignores2) => ({
    files: parsedFiles,
    ...ignores2 && { ignores: ignores2 },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaFeatures: { globalReturn: true },
        extraFileExtensions: componentExts.map((ext) => `.${ext}`),
        ...isTypeAware && {
          ...allowDefaultProjects ? {
            projectService: {
              allowDefaultProject: allowDefaultProjects,
              defaultProject: tsconfigPath
            }
          } : { project: tsconfigPath },
          tsconfigRootDir: process.cwd()
        },
        sourceType: "module",
        ...parserOptions
      }
    }
  });
  const typeAwareRules = {
    "ts-eslint/no-unnecessary-type-parameters": "off",
    // "ts-eslint/non-nullable-type-assertion-style": "off",
    "ts-eslint/prefer-nullish-coalescing": ["error", { ignoreConditionalTests: true }],
    "ts-eslint/restrict-template-expressions": [
      "error",
      { allowBoolean: true, allowNullish: true, allowNumber: true }
    ],
    "ts-eslint/return-await": ["error", "in-try-catch"]
  };
  return [
    {
      name: `zayne/ts-eslint/${isTypeAware ? "type-aware-setup" : "setup"}`,
      ...makeParser(files),
      ...isTypeAware && makeParser(filesTypeAware, ignoresTypeAware)
    },
    ...renamePluginInConfigs(
      tsEslint.configs[isTypeAware ? "strictTypeChecked" : "strict"],
      { "@typescript-eslint": "ts-eslint" },
      { files, name: `zayne/ts-eslint/${isTypeAware ? "strictTypeChecked" : "strict"}` }
    ),
    ...stylistic2 ? renamePluginInConfigs(
      tsEslint.configs[isTypeAware ? "stylisticTypeChecked" : "stylistic"],
      { "@typescript-eslint": "ts-eslint" },
      { files, name: `zayne/ts-eslint/${isTypeAware ? "stylisticTypeChecked" : "stylistic"}` }
    ) : [],
    {
      files,
      name: "zayne/ts-eslint/rules",
      rules: {
        "ts-eslint/array-type": ["error", { default: "array-simple" }],
        "ts-eslint/consistent-type-definitions": ["error", "type"],
        "ts-eslint/default-param-last": "error",
        "ts-eslint/member-ordering": "error",
        "ts-eslint/method-signature-style": ["error", "property"],
        "ts-eslint/no-confusing-void-expression": "off",
        "ts-eslint/no-empty-function": [
          "error",
          { allow: ["arrowFunctions", "functions", "methods"] }
        ],
        "ts-eslint/no-import-type-side-effects": "error",
        "ts-eslint/no-shadow": "error",
        "ts-eslint/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTernary: true
          }
        ],
        "ts-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
        "ts-eslint/no-use-before-define": "off",
        "ts-eslint/no-useless-constructor": "error",
        ...isTypeAware && typeAwareRules,
        ...overrides
      }
    }
  ];
};

// src/configs/unicorn.ts
var unicorn = async (options = {}) => {
  const { overrides } = options;
  const eslintPluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'));
  return [
    { ...eslintPluginUnicorn.configs["flat/recommended"], name: "zayne/unicorn/recommended" },
    {
      name: "zayne/unicorn/rules",
      rules: {
        "unicorn/filename-case": [
          "warn",
          {
            cases: {
              camelCase: true,
              kebabCase: true,
              pascalCase: true
            }
          }
        ],
        "unicorn/new-for-builtins": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-negated-condition": "off",
        "unicorn/no-null": "off",
        "unicorn/no-useless-undefined": ["error", { checkArguments: true }],
        "unicorn/numeric-separators-style": "off",
        "unicorn/prevent-abbreviations": "off",
        ...overrides
      }
    }
  ];
};

// src/configs/imports.ts
var imports = (options) => {
  const { overrides, stylistic: stylistic2 = true, typescript: typescript2 = true } = options;
  return [
    {
      plugins: {
        import: default3
      },
      ...typescript2 && { settings: default3.flatConfigs.typescript.settings },
      name: "zayne/import/setup"
    },
    {
      name: "zayne/import/rules",
      rules: {
        ...default3.flatConfigs.recommended.rules,
        ...typescript2 && default3.flatConfigs.typescript.rules,
        "import/export": "error",
        "import/extensions": [
          "error",
          "never",
          { ignorePackages: true, pattern: { png: "always", svg: "always" } }
        ],
        "import/first": "error",
        "import/namespace": "off",
        "import/no-absolute-path": "error",
        "import/no-cycle": ["error", { ignoreExternal: true, maxDepth: 3 }],
        "import/no-duplicates": "error",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
        "import/no-mutable-exports": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-named-default": "error",
        "import/no-relative-packages": "error",
        "import/no-self-import": "error",
        "import/no-unresolved": "off",
        "import/no-useless-path-segments": ["error", { commonjs: true }],
        "import/prefer-default-export": "off",
        ...stylistic2 && { "import/newline-after-import": "error" },
        ...overrides
      }
    }
  ];
};

// src/configs/perfectionist.ts
var perfectionist = async (options = {}) => {
  const { overrides } = options;
  const eslintPluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'));
  return [
    {
      name: "zayne/perfectionist/rules",
      plugins: {
        perfectionist: eslintPluginPerfectionist
      },
      rules: {
        "perfectionist/sort-array-includes": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-classes": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-interfaces": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-intersection-types": [
          "warn",
          {
            groups: [
              "conditional",
              "literal",
              "import",
              "intersection",
              "keyword",
              "tuple",
              "named",
              "object",
              "function",
              "operator",
              "union",
              "nullish"
            ],
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-maps": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-object-types": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-objects": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-switch-case": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-union-types": [
          "warn",
          {
            groups: [
              "conditional",
              "literal",
              "import",
              "intersection",
              "keyword",
              "tuple",
              "named",
              "object",
              "function",
              "operator",
              "union",
              "nullish"
            ],
            order: "asc",
            type: "alphabetical"
          }
        ],
        "perfectionist/sort-variable-declarations": [
          "warn",
          {
            order: "asc",
            type: "alphabetical"
          }
        ],
        // "perfectionist/sort-svelte-attributes": [
        // 	"warn",
        // 	{
        // 		order: "asc",
        // 		type: "alphabetical",
        // 	},
        // ],
        // "perfectionist/sort-astro-attributes": [
        // 	"warn",
        // 	{
        // 		order: "asc",
        // 		type: "alphabetical",
        // 	},
        // ],
        // "perfectionist/sort-vue-attributes": [
        // 	"warn",
        // 	{
        // 		order: "asc",
        // 		type: "alphabetical",
        // 	},
        // ],
        // "perfectionist/sort-jsx-props": [
        // 	"warn",
        // 	{
        // 		// ignorePattern: ["src"],
        // 		order: "asc",
        // 		type: "alphabetical",
        // 	},
        // ],
        ...overrides
      }
    }
  ];
};

// src/configs/stylistic.ts
var stylistic = async (options = {}) => {
  const { jsx: jsx2 = true, overrides } = options;
  const eslintPluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));
  return [
    // == Stylistic Rules (Optional)
    {
      name: "zayne/stylistic/rules",
      plugins: {
        stylistic: eslintPluginStylistic
      },
      rules: {
        "stylistic/no-floating-decimal": "error",
        "stylistic/spaced-comment": [
          "warn",
          "always",
          {
            block: {
              balanced: true,
              exceptions: ["*"],
              markers: ["!"]
            },
            line: {
              exceptions: ["/", "#"],
              markers: ["/"]
            }
          }
        ],
        ...jsx2 && {
          "stylistic/jsx-self-closing-comp": "error"
        },
        ...overrides
      }
    }
  ];
};

// src/configs/jsonc.ts
var jsonc = async (options = {}) => {
  const { files, overrides, stylistic: stylistic2 = true } = options;
  const [eslintPluginJsonc, jsoncParser] = await Promise.all([
    interopDefault(import('eslint-plugin-jsonc')),
    interopDefault(import('jsonc-eslint-parser'))
  ]);
  return [
    {
      name: "zayne/jsonc/setup",
      plugins: {
        jsonc: eslintPluginJsonc
      }
    },
    {
      files: files ?? [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
      languageOptions: {
        parser: jsoncParser
      },
      name: "zayne/jsonc/rules",
      rules: {
        "jsonc/no-bigint-literals": "error",
        "jsonc/no-binary-expression": "error",
        "jsonc/no-binary-numeric-literals": "error",
        "jsonc/no-dupe-keys": "error",
        "jsonc/no-escape-sequence-in-identifier": "error",
        "jsonc/no-floating-decimal": "error",
        "jsonc/no-hexadecimal-numeric-literals": "error",
        "jsonc/no-infinity": "error",
        "jsonc/no-multi-str": "error",
        "jsonc/no-nan": "error",
        "jsonc/no-number-props": "error",
        "jsonc/no-numeric-separators": "error",
        "jsonc/no-octal": "error",
        "jsonc/no-octal-escape": "error",
        "jsonc/no-octal-numeric-literals": "error",
        "jsonc/no-parenthesized": "error",
        "jsonc/no-plus-sign": "error",
        "jsonc/no-regexp-literals": "error",
        "jsonc/no-sparse-arrays": "error",
        "jsonc/no-template-literals": "error",
        "jsonc/no-undefined-value": "error",
        "jsonc/no-unicode-codepoint-escapes": "error",
        "jsonc/no-useless-escape": "error",
        "jsonc/space-unary-ops": "error",
        "jsonc/valid-json-number": "error",
        "jsonc/vue-custom-block/no-parsing-error": "error",
        ...stylistic2 && {
          "jsonc/array-bracket-spacing": ["error", "never"],
          "jsonc/comma-dangle": ["error", "never"],
          "jsonc/comma-style": ["error", "last"],
          "jsonc/key-spacing": ["error", { afterColon: true, beforeColon: false }],
          "jsonc/object-curly-newline": ["error", { consistent: true, multiline: true }],
          "jsonc/object-curly-spacing": ["error", "always"],
          "jsonc/object-property-newline": ["error", { allowMultiplePropertiesPerLine: true }],
          "jsonc/quote-props": "error",
          "jsonc/quotes": "error"
        },
        ...overrides
      }
    }
  ];
};

// src/configs/jsdoc.ts
var jsdoc = async (options = {}) => {
  const { overrides, stylistic: stylistic2 = true } = options;
  const eslintPluginJsdoc = await interopDefault(import('eslint-plugin-jsdoc'));
  return [
    {
      name: "zayne/jsdoc/rules",
      plugins: {
        jsdoc: eslintPluginJsdoc
      },
      rules: {
        "jsdoc/check-access": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-property-names": "warn",
        "jsdoc/check-types": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/require-description": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/require-property": "warn",
        "jsdoc/require-property-description": "warn",
        "jsdoc/require-property-name": "warn",
        "jsdoc/require-returns-check": "warn",
        "jsdoc/require-returns-description": "warn",
        "jsdoc/require-yields-check": "warn",
        ...stylistic2 && {
          "jsdoc/check-alignment": "warn",
          "jsdoc/multiline-blocks": "warn"
        },
        ...overrides
      }
    }
  ];
};
var ReactRefreshAllowConstantExportPackages = ["vite"];
var RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
var NextJsPackages = ["next"];
var eslintReactRenameMap = {
  "@eslint-react": "react",
  "@eslint-react/debug": "react/debug",
  "@eslint-react/dom": "react/dom",
  "@eslint-react/hooks-extra": "react/hooks-extra",
  "@eslint-react/naming-convention": "react/naming-convention",
  "@eslint-react/web-api": "react/web-api"
};
var react = async (options = {}) => {
  const { files, overrides, typescript: typescript2 = true } = options;
  await ensurePackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "typescript-eslint"
  ]);
  const [eslintPluginReact, eslintReactHooks, eslintPluginReactRefresh] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-hooks')),
    interopDefault(import('eslint-plugin-react-refresh'))
  ]);
  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
  const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
  const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));
  const recommendedReactConfig = eslintPluginReact.configs[typescript2 ? "recommended-type-checked" : "recommended"];
  return [
    {
      name: "zayne/react/setup",
      plugins: {
        ...renamePlugins(recommendedReactConfig.plugins, eslintReactRenameMap),
        "react-hooks": fixupPluginRules(eslintReactHooks),
        "react-refresh": eslintPluginReactRefresh
      },
      settings: recommendedReactConfig.settings
    },
    {
      files: files ?? [GLOB_SRC],
      name: "zayne/react/rules",
      rules: {
        ...renameRules(recommendedReactConfig.rules, eslintReactRenameMap),
        "react/avoid-shorthand-boolean": "error",
        "react/function-component-definition": "off",
        "react/hooks-extra/ensure-custom-hooks-using-other-hooks": "error",
        "react/hooks-extra/prefer-use-state-lazy-initialization": "error",
        "react/naming-convention/component-name": "warn",
        "react/naming-convention/use-state": "warn",
        "react/no-array-index-key": "error",
        "react/no-children-count": "off",
        "react/no-children-only": "off",
        "react/no-children-prop": "error",
        "react/no-children-to-array": "off",
        "react/no-clone-element": "off",
        "react/no-missing-component-display-name": "error",
        "react/prefer-destructuring-assignment": "error",
        "react/prefer-read-only-props": "off",
        "react/prefer-shorthand-fragment": "error",
        // Hook rules
        // eslint-disable-next-line perfectionist/sort-objects
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        // react refresh
        "react-refresh/only-export-components": [
          "warn",
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...isUsingNext ? [
                "dynamic",
                "dynamicParams",
                "revalidate",
                "fetchCache",
                "runtime",
                "preferredRegion",
                "maxDuration",
                "config",
                "generateStaticParams",
                "metadata",
                "generateMetadata",
                "viewport",
                "generateViewport"
              ] : [],
              ...isUsingRemix ? ["meta", "links", "headers", "loader", "action"] : []
            ]
          }
        ],
        // overrides
        ...overrides
      }
    }
  ];
};

// src/configs/sort.ts
var sortPackageJson = () => [
  {
    files: ["**/package.json"],
    name: "zayne/sort/package-json",
    rules: {
      "jsonc/sort-array-values": [
        "error",
        {
          order: { type: "asc" },
          pathPattern: "^files$"
        }
      ],
      "jsonc/sort-keys": [
        "error",
        {
          order: [
            "publisher",
            "name",
            "displayName",
            "type",
            "version",
            "private",
            "packageManager",
            "description",
            "author",
            "contributors",
            "license",
            "funding",
            "homepage",
            "repository",
            "bugs",
            "keywords",
            "categories",
            "sideEffects",
            "exports",
            "main",
            "module",
            "unpkg",
            "jsdelivr",
            "types",
            "typesVersions",
            "bin",
            "icon",
            "files",
            "engines",
            "activationEvents",
            "contributes",
            "scripts",
            "peerDependencies",
            "peerDependenciesMeta",
            "dependencies",
            "optionalDependencies",
            "devDependencies",
            "pnpm",
            "overrides",
            "resolutions",
            "husky",
            "simple-git-hooks",
            "lint-staged",
            "eslintConfig"
          ],
          pathPattern: "^$"
        },
        {
          order: { type: "asc" },
          pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$"
        },
        {
          order: { type: "asc" },
          pathPattern: "^(?:resolutions|overrides|pnpm.overrides)$"
        },
        {
          order: ["types", "import", "require", "default"],
          pathPattern: "^exports.*$"
        },
        {
          order: [
            // client hooks only
            "pre-commit",
            "prepare-commit-msg",
            "commit-msg",
            "post-commit",
            "pre-rebase",
            "post-rewrite",
            "post-checkout",
            "post-merge",
            "pre-push",
            "pre-auto-gc"
          ],
          pathPattern: "^(?:gitHooks|husky|simple-git-hooks)$"
        }
      ]
    }
  }
];
var sortTsconfig = () => [
  {
    files: ["**/tsconfig.json", "**/tsconfig.*.json"],
    name: "zayne/sort/tsconfig-json",
    rules: {
      "jsonc/sort-keys": [
        "error",
        {
          order: ["extends", "compilerOptions", "references", "files", "include", "exclude"],
          pathPattern: "^$"
        },
        {
          order: [
            /* Projects */
            "incremental",
            "composite",
            "tsBuildInfoFile",
            "disableSourceOfProjectReferenceRedirect",
            "disableSolutionSearching",
            "disableReferencedProjectLoad",
            /* Language and Environment */
            "target",
            "jsx",
            "jsxFactory",
            "jsxFragmentFactory",
            "jsxImportSource",
            "lib",
            "moduleDetection",
            "noLib",
            "reactNamespace",
            "useDefineForClassFields",
            "emitDecoratorMetadata",
            "experimentalDecorators",
            /* Modules */
            "baseUrl",
            "rootDir",
            "rootDirs",
            "customConditions",
            "module",
            "moduleResolution",
            "moduleSuffixes",
            "noResolve",
            "paths",
            "resolveJsonModule",
            "resolvePackageJsonExports",
            "resolvePackageJsonImports",
            "typeRoots",
            "types",
            "allowArbitraryExtensions",
            "allowImportingTsExtensions",
            "allowUmdGlobalAccess",
            /* JavaScript Support */
            "allowJs",
            "checkJs",
            "maxNodeModuleJsDepth",
            /* Type Checking */
            "strict",
            "strictBindCallApply",
            "strictFunctionTypes",
            "strictNullChecks",
            "strictPropertyInitialization",
            "allowUnreachableCode",
            "allowUnusedLabels",
            "alwaysStrict",
            "exactOptionalPropertyTypes",
            "noFallthroughCasesInSwitch",
            "noImplicitAny",
            "noImplicitOverride",
            "noImplicitReturns",
            "noImplicitThis",
            "noPropertyAccessFromIndexSignature",
            "noUncheckedIndexedAccess",
            "noUnusedLocals",
            "noUnusedParameters",
            "useUnknownInCatchVariables",
            /* Emit */
            "declaration",
            "declarationDir",
            "declarationMap",
            "downlevelIteration",
            "emitBOM",
            "emitDeclarationOnly",
            "importHelpers",
            "importsNotUsedAsValues",
            "inlineSourceMap",
            "inlineSources",
            "mapRoot",
            "newLine",
            "noEmit",
            "noEmitHelpers",
            "noEmitOnError",
            "outDir",
            "outFile",
            "preserveConstEnums",
            "preserveValueImports",
            "removeComments",
            "sourceMap",
            "sourceRoot",
            "stripInternal",
            /* Interop Constraints */
            "allowSyntheticDefaultImports",
            "esModuleInterop",
            "forceConsistentCasingInFileNames",
            "isolatedDeclarations",
            "isolatedModules",
            "preserveSymlinks",
            "verbatimModuleSyntax",
            /* Completeness */
            "skipDefaultLibCheck",
            "skipLibCheck"
          ],
          pathPattern: "^compilerOptions$"
        }
      ]
    }
  }
];

// src/configs/jsx.ts
var jsx = () => {
  return [
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      name: "zayne/jsx/setup"
    }
  ];
};

// src/factory.ts
var ReactPackages = ["react", "react-dom", "next", "remix"];
var defaultPluginRenaming = {
  ...eslintReactRenameMap,
  "@stylistic": "stylistic",
  "@typescript-eslint": "ts-eslint",
  "import-x": "import",
  n: "node"
};
var resolveOptions = (option) => isObject(option) ? option : {};
var zayne = (options = {}, userConfigs = []) => {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    jsonc: enableJsonc = true,
    jsx: enableJsx = true,
    perfectionist: enablePerfectionist = true,
    react: enableReact = ReactPackages.some((pkg) => isPackageExists(pkg)),
    stylistic: enableStylistic = true,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
    ...restOfOptions
  } = options;
  const isStylistic = Boolean(enableStylistic);
  const tsconfigPath = isObject(enableTypeScript) && "tsconfigPath" in enableTypeScript ? enableTypeScript.tsconfigPath : null;
  const configs = [];
  if (enableGitignore) {
    configs.push(gitIgnores(resolveOptions(enableGitignore)));
  }
  configs.push(
    ignores(restOfOptions.ignores),
    javascript(restOfOptions.javascript),
    imports({ stylistic: isStylistic }),
    jsdoc({ stylistic: isStylistic })
  );
  if (enablePerfectionist) {
    configs.push(perfectionist(resolveOptions(enablePerfectionist)));
  }
  if (enableUnicorn) {
    configs.push(unicorn(resolveOptions(enableUnicorn)));
  }
  if (enableJsonc) {
    configs.push(
      jsonc({
        stylistic: isStylistic,
        ...resolveOptions(enableJsonc)
      }),
      sortPackageJson(),
      sortTsconfig()
    );
  }
  if (enableTypeScript) {
    configs.push(
      typescript({
        componentExts,
        stylistic: isStylistic,
        ...resolveOptions(enableTypeScript)
      })
    );
  }
  if (enableJsx) {
    configs.push(jsx());
  }
  if (enableStylistic) {
    const stylisticOptions = resolveOptions(enableStylistic);
    !Object.hasOwn(stylisticOptions, "jsx") && (stylisticOptions.jsx = enableJsx);
    configs.push(stylistic(stylisticOptions));
  }
  if (restOfOptions.tailwindcss) {
    configs.push(tailwindcss(resolveOptions(restOfOptions.tailwindcss)));
  }
  if (enableReact) {
    configs.push(
      react({
        ...resolveOptions(enableReact),
        typescript: Boolean(tsconfigPath)
      })
    );
  }
  if ("files" in restOfOptions) {
    throw new Error(
      '[@zayne-labs/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second config array instead.'
    );
  }
  let composer = new FlatConfigComposer();
  composer = composer.append(...configs, ...userConfigs);
  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }
  return composer;
};

export { GLOB_ALL_SRC, GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_CSS, GLOB_EXCLUDE, GLOB_GRAPHQL, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SRC, GLOB_SRC_EXT, GLOB_STYLES, GLOB_SVELTE, GLOB_SVG, GLOB_TESTS, GLOB_TOML, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_XML, GLOB_YAML, combine, zayne as default, defaultPluginRenaming, ensurePackages, eslintReactRenameMap, gitIgnores, ignores, imports, interopDefault, isPackageInScope, javascript, jsdoc, jsonc, perfectionist, react, renamePluginInConfigs, renamePlugins, renameRules, sortPackageJson, sortTsconfig, stylistic, tailwindcss, typescript, unicorn, zayne };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map