export const defaultPluginRenameMap = {
	"@eslint-react/debug": "react-debug",
	"@eslint-react/dom": "react-dom",
	"@eslint-react/hooks-extra": "react-hooks-extra",
	"@eslint-react/naming-convention": "react-naming-convention",
	"@eslint-react/web-api": "react-web-api",

	/* eslint-disable perfectionist/sort-objects */
	// @eslint-react has to be below the rest to avoid rename issues
	"@eslint-react": "react",

	"@next/next": "nextjs-next",

	"@stylistic": "stylistic",

	"@tanstack/query": "tanstack-query",

	"@typescript-eslint": "ts-eslint",

	"import-x": "import",

	n: "node",
} as const;
