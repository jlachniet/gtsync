#!/usr/bin/env node

import { InvalidArgumentError, program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { getAudioDataFromPath, getMonoSamples } from './audio.js';

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

/**
 * The CLI options.
 */
interface ProgramOpts {
	/**
	 * The sample rate to process at.
	 */
	sampleRate: number;
}

const CD_SAMPLE_RATE = 44_100;

const MIN_SAMPLE_RATE = 1000;
const MAX_SAMPLE_RATE = 192_000;

/**
 * Parses a sample rate option.
 * @param value - The raw option value
 * @returns The sample rate
 */
function parseSampleRate(value: string): number {
	const sampleRate = Number(value);

	if (
		!Number.isInteger(sampleRate) ||
		sampleRate < MIN_SAMPLE_RATE ||
		sampleRate > MAX_SAMPLE_RATE
	) {
		throw new InvalidArgumentError(
			`Must be a whole number between ${MIN_SAMPLE_RATE} and ${MAX_SAMPLE_RATE}.`,
		);
	}

	return sampleRate;
}

program
	.name('gtsync')
	.version(packageJson.version)
	.description(packageJson.description)
	.argument('<source-path>', 'the path to the source audio')
	.argument('<target-path>', 'the path to the target audio')
	.argument('<output-path>', 'the path where the synced audio will be written')
	.option(
		'--sample-rate <hz>',
		'the sample rate to process at',
		parseSampleRate,
		CD_SAMPLE_RATE,
	);

program.parse();

const [sourcePath, targetPath] = program.args as ProgramArgs;
const { sampleRate } = program.opts<ProgramOpts>();

const sourceAudio = await getAudioDataFromPath(
	sourcePath,
	'source',
	sampleRate,
);
const targetAudio = await getAudioDataFromPath(
	targetPath,
	'target',
	sampleRate,
);

console.info(
	`Source audio loaded (${sourceAudio.channelData[0]!.length} samples at ${sourceAudio.sampleRate} Hz)`,
);
console.info(
	`Target audio loaded (${targetAudio.channelData[0]!.length} samples at ${targetAudio.sampleRate} Hz)`,
);

const sourceAudioMonoSamples = getMonoSamples(sourceAudio);
const targetAudioMonoSamples = getMonoSamples(targetAudio);
