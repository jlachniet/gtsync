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
		'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
		'sort-keys': 'off',
	},
});
