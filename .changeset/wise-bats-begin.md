---
"@zayne-labs/eslint-config": patch
---

fix(react): 🔧 ♻️ refactor react-refresh plugin configuration

Move react-refresh plugin and its rules into a separate config object that's conditionally added. This improves code organization and prevents potential issues when the refresh option is disabled.
