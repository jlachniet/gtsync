import decodeFlac, { type AudioData } from '@audio/decode-flac';
import decodeMp3 from '@audio/decode-mp3';
import audioType from 'audio-type';
import { program } from 'commander';
import { readFile } from 'node:fs/promises';

/**
 * An audio decoder function.
 */
type AudioDecoder = typeof decodeFlac;

const SUPPORTED_FORMATS = new Map<string, AudioDecoder>([
	['flac', decodeFlac],
	['mp3', decodeMp3],
]);

/**
 * Gets or interpolates a sample at a position
 * @param samples - The samples
 * @param position - The position
 * @returns The sample
 */
function getInterpolatedSample(
	samples: Float32Array,
	position: number,
): number {
	const lowerIndex = Math.floor(position);

	const upperSampleWeight = position - lowerIndex;

	const lowerSample = samples[lowerIndex] ?? 0;
	const upperSample = samples[lowerIndex + 1] ?? 0;

	return (
		lowerSample * (1 - upperSampleWeight) + upperSample * upperSampleWeight
	);
}

/**
 * Resamples an AudioData to a given sample rate
 * @param audioData - The AudioData
 * @param sampleRate - The sample rate to resample to
 * @returns The resampled AudioData
 */
function resample(audioData: AudioData, sampleRate: number): AudioData {
	const ratio = audioData.sampleRate / sampleRate;

	return {
		channelData: audioData.channelData.map((samples) => {
			const resampled = new Float32Array(Math.round(samples.length / ratio));

			for (let index = 0; index < resampled.length; index++) {
				resampled[index] = getInterpolatedSample(samples, index * ratio);
			}

			return resampled;
		}),
		sampleRate,
	};
}

/**
 * Gets the samples of an AudioData as mono
 * @param audioData - The AudioData
 * @returns The mono samples
 */
export function getMonoSamples(audioData: AudioData): Float32Array {
	const samples = new Float32Array(audioData.channelData[0]!.length);

	for (let index = 0; index < samples.length; index++) {
		let total = 0;

		for (const channel of audioData.channelData) {
			total += channel[index]!;
		}

		samples[index] = total / audioData.channelData.length;
	}

	return samples;
}

/**
 * Gets the AudioData of a file at the given path, resampled to the given sample
 * rate.
 * @param path - The path
 * @param label - The label to describe the audio in error messages
 * @param sampleRate - The sample rate to resample to
 * @returns The AudioData
 */
export async function getAudioDataFromPath(
	path: string,
	label: string,
	sampleRate: number,
): Promise<AudioData> {
	let file;

	try {
		file = await readFile(path);
	} catch (error) {
		program.error(`Failed to read ${label} audio\n${error}`);
	}

	const format = audioType(file);

	if (!format) {
		program.error(`Unrecognized ${label} audio format`);
	}

	const decode = SUPPORTED_FORMATS.get(format);

	if (!decode) {
		program.error(`Unsupported ${label} audio format: ${format}`);
	}

	let audioData;

	try {
		audioData = await decode(file);
	} catch {
		program.error(`Failed to decode ${label} audio`);
	}

	if (!audioData.channelData[0] || !audioData.sampleRate) {
		program.error(`Failed to decode ${label} audio`);
	}

	return resample(audioData, sampleRate);
}
