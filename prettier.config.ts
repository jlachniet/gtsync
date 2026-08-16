import type { Config } from 'prettier';

export default {
	useTabs: true,
	singleQuote: true,
	quoteProps: 'consistent',
	plugins: ['prettier-plugin-organize-imports'],
} satisfies Config;
