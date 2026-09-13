declare module 'audio-type' {
	export default function audioType(
		buffer: Buffer | ArrayBuffer | Uint8Array,
	): string | undefined;
}
