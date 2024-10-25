---
"@zayne-labs/eslint-config": patch
---

feat(config): enable stricter node rules for library code

-  Enable `node/no-unsupported-features/es-syntax` and `node/no-unsupported-featuresanode-builtins` rules for library code
-  Set `unicorn/prefer-global-this` to `warn` for library code
-  Update `eslint.config.js` to use `"lib-strict"` application type
