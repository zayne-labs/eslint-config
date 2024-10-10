# @zayne-labs/eslint-config

## 0.1.6

### Patch Changes

-  0337c5d: stop ingonring rest unused vars

## 0.1.5

### Patch Changes

-  915bab7: update node and unicorn configs

   This commit updates the node and unicorn configuration files to include a new option for specifying the application type. The `node.ts` file now accepts an `OptionsAppType` parameter, which allows the user to specify whether the configuration is for an "app" or a "lib". Similarly, the `unicorn.ts` file also accepts the `OptionsAppType` parameter and includes a new rule, `unicorn/prefer-global-this`, which is enabled only for "lib" type applications.

   The changes were made in the following files:

   -  `src/configs/node.ts`
   -  `src/configs/unicorn.ts`
   -  `src/factory.ts`
   -  `src/types/common.ts`

## 0.1.4

### Patch Changes

-  75e4353: turn off ts rule no use before define

## 0.1.3

### Patch Changes

-  f04d587: fix bug in node overrides
   change all imports to async
   update deps

## 0.1.2

### Patch Changes

-  04576cd: fix tailwind plugin bug

## 0.1.1

### Patch Changes

-  a1fcc2d: added new option to ts-eslint no unsed vars rule

## 0.1.0

### Minor Changes

-  5d7f5ea: add node config

## 0.0.7

### Patch Changes

-  397a218: add new options to a few configs

## 0.0.6

### Patch Changes

-  93180c1: fix types for tailwind

## 0.0.5

### Patch Changes

-  a2ff5fb: fix name collision reeact

## 0.0.4

### Patch Changes

-  1be7004: fix react plugin issue

## 0.0.3

### Patch Changes

-  1e427b9: fix ish on tailwind

## 0.0.2

### Patch Changes

-  fa77bf5: enable react and tailwind byh default

## 0.0.1

### Patch Changes

-  09f8f01: first patch
