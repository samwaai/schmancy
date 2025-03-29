import { NotificationType } from './notification';
/**
 * Audio service for playing notification sounds.
 * Uses Web Audio API with fallback to HTML5 Audio.
 */
export declare class NotificationAudioService {
    private audioContext;
    private soundBuffers;
    private volume;
    private muted;
    private soundGenerator;
    private soundUrls;
    constructor();
    /**
     * Initialize audio files - generate programmatically if needed
     */
    private initializeAudioFiles;
    /**
     * Lazy-initialize the audio context
     */
    private getAudioContext;
    /**
     * Preload all notification sounds
     */
    private preloadSounds;
    /**
     * Load a sound file and decode it
     */
    private loadSound;
    /**
     * Play a notification sound
     */
    playSound(type: NotificationType): Promise<void>;
    /**
     * Play a directly generated sound when other methods fail
     */
    private playDirectGeneratedSound;
    /**
     * Play sound using HTML5 Audio as a fallback
     */
    private playFallbackSound;
    /**
     * Set volume for notification sounds (0.0 to 1.0)
     */
    setVolume(volume: number): void;
    /**
     * Get current volume level
     */
    getVolume(): number;
    /**
     * Mute notification sounds
     */
    mute(): void;
    /**
     * Unmute notification sounds
     */
    unmute(): void;
    /**
     * Check if notification sounds are muted
     */
    isMuted(): boolean;
    /**
     * Set custom sound URL for a notification type
     */
    setSoundUrl(type: NotificationType, url: string): void;
    /**
     * Get the current sound URL for a notification type
     */
    getSoundUrl(type: NotificationType): string;
}
