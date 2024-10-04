---
"@zayne-labs/eslint-config": patch
---

update node and unicorn configs

This commit updates the node and unicorn configuration files to include a new option for specifying the application type. The `node.ts` file now accepts an `OptionsAppType` parameter, which allows the user to specify whether the configuration is for an "app" or a "lib". Similarly, the `unicorn.ts` file also accepts the `OptionsAppType` parameter and includes a new rule, `unicorn/prefer-global-this`, which is enabled only for "lib" type applications.

The changes were made in the following files:

-  `src/configs/node.ts`
-  `src/configs/unicorn.ts`
-  `src/factory.ts`
-  `src/types/common.ts`
