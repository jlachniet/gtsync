#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { getAudioDataFromPath } from './fs.js';

/**
 * The CLI arguments.
 */
type ProgramArgs = [
	/**
	 * The path to the source audio.
	 */
	sourcePath: string,
	/**
	 * The path to the target audio.
	 */
	targetPath: string,
	/**
	 * The path where the synced audio will be written.
	 */
	outputPath: string,
];

program
	.name('gtsync')
	.version(packageJson.version)
	.description(packageJson.description)
	.argument('<source-path>', 'the path to the source audio')
	.argument('<target-path>', 'the path to the target audio')
	.argument('<output-path>', 'the path where the synced audio will be written');

program.parse();

const [sourcePath, targetPath] = program.args as ProgramArgs;

const sourceAudio = await getAudioDataFromPath(sourcePath, 'source');
const targetAudio = await getAudioDataFromPath(targetPath, 'target');

console.info(
	`Source audio loaded (${sourceAudio.channelData[0]!.length} samples)`,
);
console.info(
	`Target audio loaded (${targetAudio.channelData[0]!.length} samples)`,
);
