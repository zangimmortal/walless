module.exports = {
	root: true,
	extends: ['@walless/eslint-config'],
	ignorePatterns: [
		'node_modules',
		'tool/batch/**',
		'packages/core/utils/platform.ts',
		'packages/graphql/types.ts',
	],
	env: {
		node: true,
	},
	globals: {
		window: true,
		document: true,
		navigator: true,
		fetch: true,
		WebAssembly: true,
	},
};
