// Sound and Web Audio synthesizer utilities for calming chimes, ambient audio & Text-To-Speech in Portuguese

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play a gentle pop click sound
  playPop() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio might be muted
    }
  }

  // Play a soft, reassuring completion chime
  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // C5 to G5 harmonious interval
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      osc2.frequency.setValueAtTime(261.63, now); // C4 support
      osc2.frequency.exponentialRampToValueAtTime(329.63, now + 0.3);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Gentle reminder alarm alert (non-jarring double chime)
  playAlertChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      [0, 0.25].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now + offset); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + offset + 0.1); // A5

        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.25);
      });
    } catch {
      // Audio context fallthrough
    }
  }

  // Toggle ambient calming drone (432Hz harmonic soft waves)
  toggleAmbientSound(): boolean {
    try {
      const ctx = this.getAudioContext();

      if (this.isAmbientPlaying) {
        this.stopAmbientSound();
        return false;
      }

      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 1.5);

      const freqs = [108, 216, 324, 432]; // Harmonic soothing series
      this.ambientOscillators = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(this.ambientGain!);
        osc.start(now);
        return osc;
      });

      this.ambientGain.connect(ctx.destination);
      this.isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  stopAmbientSound() {
    if (this.ambientGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        this.ambientOscillators = [];
        this.isAmbientPlaying = false;
      }, 550);
    }
  }

  getIsAmbientPlaying() {
    return this.isAmbientPlaying;
  }

  // Speech synthesizer for reading reminders aloud in Portuguese
  speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Slightly calmer, slower pace for neurodivergent clarity
    utterance.pitch = 1.0;

    // Try to select a Brazilian Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const soundManager = new SoundManager();
