import { defineConfig } from 'oxlint';

export default defineConfig({
	categories: {
		correctness: 'warn',
		suspicious: 'warn',
		pedantic: 'warn',
		perf: 'warn',
		style: 'warn',
		restriction: 'warn',
	},
	rules: {
		'func-style': 'off',
		'init-declarations': 'off',
		'max-statements': 'off',
		'no-async-await': 'off',
		'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
		'no-non-null-assertion': 'off',
		'no-magic-numbers': ['warn', { ignore: [0] }],
		'one-var': 'off',
		'prefer-set-has': 'off',
		'sort-keys': 'off',
		'sort-imports': 'off',
	},
});
