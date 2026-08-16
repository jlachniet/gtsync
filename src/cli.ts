import { Command } from 'commander';

const program = new Command();

program
	.argument('<source-path>', 'The path to the source audio file')
	.argument('<target-path>', 'The path to the target audio file')
	.argument('<output-path>', 'The path to the output audio file');

program.parse();
