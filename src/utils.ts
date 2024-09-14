import type { Awaitable, TypedFlatConfigItem } from "./types";

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/**
 * Combine array and non-array configs into a single array.
 */
export const combine = async (
	...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
) => {
	const resolved = await Promise.all(configs);

	return resolved.flat();
};

export const interopDefault = async <TModule>(
	module: Awaitable<TModule>
): Promise<TModule extends { default: infer TDefaultExport } ? TDefaultExport : TModule> => {
	const resolved = await module;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return (resolved as { default: never }).default ?? resolved;
};
