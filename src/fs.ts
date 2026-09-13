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
 * Gets the AudioData of a file at the given path.
 * @param path - The path
 * @param label - The label to describe the audio in error messages
 * @returns The AudioData
 */
export async function getAudioDataFromPath(
	path: string,
	label: string,
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

	return audioData;
}
