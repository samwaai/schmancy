/**
 * Programmatic sound generator for Schmancy notifications
 * Uses Web Audio API to generate gentle, subtle and soft sounds for each notification type
 */
export declare class NotificationSoundGenerator {
    private audioContext;
    /**
     * Get or create AudioContext
     */
    private getAudioContext;
    playInfoSound(volume?: number): void;
    playSuccessSound(volume?: number): void;
    playWarningSound(volume?: number): void;
    playErrorSound(volume?: number): void;
    /**
     * Generate audio blob files for all notification sounds
     * Returns a Promise that resolves with URLs to the generated audio files
     */
    generateAudioFiles(volume?: number): Promise<Record<string, string>>;
    /**
     * Generate an audio file from a sound generation function
     * @param renderFunction Function that creates the sound in the provided context
     * @param sampleRate Sample rate for the audio
     * @param duration Duration in seconds
     * @returns Promise that resolves with the URL to the generated audio file
     */
    private generateAudioFile;
    /**
     * Convert AudioBuffer to WAV format
     * Based on https://github.com/Jam3/audiobuffer-to-wav
     */
    private audioBufferToWav;
    /**
     * Get audio samples from an AudioBuffer
     */
    private getAudioSamples;
    /**
     * Write 16-bit samples to a DataView
     */
    private writeInt16Samples;
    /**
     * Write a string to a DataView
     */
    private writeString;
}
