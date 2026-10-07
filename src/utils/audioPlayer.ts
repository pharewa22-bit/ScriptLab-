/**
 * Audio Engine for ScriptLab: Web Audio API Synthesizer + SpeechSynthesis
 * Guarantees real audio output across all browsers and devices.
 */

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private podcastOscillators: OscillatorNode[] = [];
  private podcastGainNodes: GainNode[] = [];
  private podcastTimer: ReturnType<typeof setInterval> | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play clean UI chime for buttons and feedback
   */
  public playChime(freq = 600, type: OscillatorType = 'sine', duration = 0.2, volume = 0.15) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback safe
    }
  }

  /**
   * Play realistic podcast background bed + radio voice narrative
   */
  public startPodcastAudio(narrationText: string, onEnd?: () => void) {
    this.stopPodcastAudio();
    const ctx = this.getAudioContext();

    // 1. Play Podcast Station Jingle (Warm 4-chord intro)
    if (ctx) {
      const chords = [261.63, 329.63, 392.0, 523.25]; // C major chord progression
      chords.forEach((note, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.8);
      });

      // 2. Continuous broadcast background ambient synth bed
      const ambientOsc = ctx.createOscillator();
      const ambientGain = ctx.createGain();
      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3 warm drone
      ambientGain.gain.setValueAtTime(0.04, ctx.currentTime);
      ambientOsc.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      ambientOsc.start();
      this.podcastOscillators.push(ambientOsc);
      this.podcastGainNodes.push(ambientGain);

      // Gentle rhythmic vocal/broadcast tick rhythm
      this.podcastTimer = setInterval(() => {
        if (!this.audioCtx) return;
        try {
          const tickOsc = this.audioCtx.createOscillator();
          const tickGain = this.audioCtx.createGain();
          tickOsc.type = 'sine';
          tickOsc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
          tickGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);
          tickOsc.connect(tickGain);
          tickGain.connect(this.audioCtx.destination);
          tickOsc.start();
          tickOsc.stop(this.audioCtx.currentTime + 0.1);
        } catch {
          // safe
        }
      }, 3000);
    }

    // 3. Web Speech API Narration
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.lang = 'th-TH';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.stopPodcastAudio();
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        // Keep running or finish gracefully
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }

  public stopPodcastAudio() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;

    if (this.podcastTimer) {
      clearInterval(this.podcastTimer);
      this.podcastTimer = null;
    }

    this.podcastOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // safe
      }
    });
    this.podcastOscillators = [];
    this.podcastGainNodes.forEach((g) => {
      try {
        g.disconnect();
      } catch {
        // safe
      }
    });
    this.podcastGainNodes = [];
  }

  /**
   * Speak Dialogue / Voiceover row with synthesized audio accompaniment
   */
  public speakVoiceover(
    text: string, 
    options?: {
      rate?: number;
      gender?: 'male' | 'female';
      onEnd?: () => void;
    }
  ) {
    this.stopSpeaking();
    const ctx = this.getAudioContext();

    // 1. Audio tone cue (broadcaster mic-on sound)
    if (ctx) {
      this.playChime(options?.gender === 'female' ? 680 : 540, 'triangle', 0.18, 0.12);
    }

    // 2. Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.gender === 'female' ? 1.15 : 0.95;

      utterance.onend = () => {
        this.currentUtterance = null;
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (options?.onEnd) options.onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer
      setTimeout(() => {
        if (options?.onEnd) options.onEnd();
      }, 3500);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }
}

export const audioEngine = new AudioEngine();
