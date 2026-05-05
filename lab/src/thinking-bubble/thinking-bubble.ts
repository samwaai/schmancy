/**
 * Thinking Bubble — living neural organism.
 *
 * Adapted from the aria project. A field of coupled Kuramoto oscillators
 * (neurons) drifts inside a harmonic blob membrane. Neurons form fading
 * curved connections when close; Hebbian learning tunes coupling; STDP
 * tunes weights. Neurogenesis grows the population toward a resting size.
 * The result: a small self-organising organism that feels alive.
 *
 * Drop it anywhere you want a "something is happening" signal.
 */
import { SchmancyElement } from '@mhmo91/schmancy/mixins';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

function intersection$(target: Element): Observable<boolean> {
  return new Observable<boolean>((subscriber) => {
    const obs = new IntersectionObserver((entries) => subscriber.next(entries[0]!.isIntersecting), {
      threshold: 0,
    });
    obs.observe(target);
    return () => obs.disconnect();
  });
}

interface Neuron {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  radius: number;
  opacity: number;
  glowRadius: number;
  driftVx: number;
  driftVy: number;
  phase: number;
  naturalFreq: number;
  freqTarget: number;
  id: number;
  birthTime: number;
  maturity: number;
  targetRadius: number;
  targetOpacity: number;
  targetGlowRadius: number;
  trace: number;
}

interface BlobHarmonic {
  n: number;
  amp: number;
  speed: number;
  phase: number;
}

interface FadingConnection {
  i: number;
  j: number;
  alpha: number;
  cpx: number;
  cpy: number;
  cpvx: number;
  cpvy: number;
  weight: number;
  coupling: number;
}

const MAX_N = 24;
const SEED_N = 10;
const W = 240;
const H = 240;
const CX = W / 2;
const CY = H / 2;
const BASE_R = 76;
const BLOB_PTS = 80;
const CONNECT_DIST = 110;
const COUPLING = 0.0008;
const FADE_RATE = 0.003;

const HARMONICS: BlobHarmonic[] = [
  { n: 2, amp: 14, speed: 0.00035, phase: 0 },
  { n: 3, amp: 10, speed: 0.00055, phase: 1.2 },
  { n: 4, amp: 6, speed: 0.00028, phase: 2.5 },
  { n: 5, amp: 4, speed: 0.00072, phase: 0.8 },
  { n: 7, amp: 2.4, speed: 0.0005, phase: 3.7 },
];

const TAU_MATURE = 2000;
const STDP_A_PLUS = 0.005;
const STDP_A_MINUS = 0.00525;
const STDP_TAU = 500;
const HEBBIAN_EPSILON = 0.00003;
const HEBBIAN_ALPHA = 1.0;

function breathEase(phase: number): number {
  if (phase < 0.3) {
    const t = phase / 0.3;
    return 1 - (1 - t) * (1 - t) * (1 - t);
  } else if (phase < 0.38) {
    return 1.0;
  } else {
    const t = (phase - 0.38) / 0.62;
    return 1 - t * t;
  }
}

function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

@customElement('schmancy-thinking-bubble')
export class SchmancyThinkingBubble extends SchmancyElement {
  static styles = [
    css`
  :host {
    display: block;
    animation:
      bubble-enter 0.6s ease-out forwards,
      bubble-breathe 6s ease-in-out 0.6s infinite,
      bubble-drift 12s ease-in-out infinite;
    will-change: opacity, transform;
  }

  @keyframes bubble-enter {
    from { opacity: 0; transform: scale(0.3); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes bubble-breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  @keyframes bubble-drift {
    0%, 100% { translate: 0 0; }
    25% { translate: 6px -4px; }
    50% { translate: -3px 5px; }
    75% { translate: -5px -2px; }
  }

  @media (prefers-reduced-motion: reduce) {
    :host { animation: none !important; }
  }
`,
  ];
  @property({ type: Number }) seeds = SEED_N;

  private wrapperRef = createRef<HTMLDivElement>();
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private rafId = 0;
  private lastDrawTime = 0;
  private primaryColor = { r: 15, g: 98, b: 254 };
  private rgbaPrefix = 'rgba(15,98,254,';

  private neurons: Neuron[] = [];
  private nextNeuronId = 0;
  private connections = new Map<number, FadingConnection>();
  private activeKeys = new Set<number>();

  private sinPhase = new Float64Array(MAX_N);
  private cosPhase = new Float64Array(MAX_N);
  private prevSinPhase = new Float64Array(MAX_N);

  private isVisible = true;
  private tabVisible = true;

  override firstUpdated(): void {
    if (reducedMotion()) return;

    const wrapper = this.wrapperRef.value;
    if (!wrapper) return;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'block w-[240px] h-[240px] motion-reduce:hidden';
    wrapper.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = W * dpr;
    this.canvas.height = H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.resolveThemeColor();
    this.initNeurons();

    this.tabVisible = document.visibilityState === 'visible';

    intersection$(this)
      .pipe(takeUntil(this.disconnecting))
      .subscribe((visible) => {
        this.isVisible = visible;
        this.syncRAF();
      });

    fromEvent(document, 'visibilitychange')
      .pipe(
        map(() => document.visibilityState === 'visible'),
        takeUntil(this.disconnecting),
      )
      .subscribe((visible) => {
        this.tabVisible = visible;
        this.syncRAF();
      });

    this.syncRAF();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopRAF();
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
  }

  private resolveThemeColor(): void {
    const vars = ['--schmancy-sys-color-primary-default', '--color-primary-default'];
    let raw = '';
    for (const v of vars) {
      raw = getComputedStyle(this).getPropertyValue(v).trim();
      if (raw) break;
    }
    if (!raw) return;

    if (raw.startsWith('#') && raw.length === 7) {
      this.primaryColor = {
        r: parseInt(raw.slice(1, 3), 16),
        g: parseInt(raw.slice(3, 5), 16),
        b: parseInt(raw.slice(5, 7), 16),
      };
    } else if (raw.startsWith('rgb')) {
      const m = raw.match(/\d+/g);
      if (m && m.length >= 3) {
        this.primaryColor = { r: +m[0]!, g: +m[1]!, b: +m[2]! };
      }
    }
    this.rgbaPrefix = `rgba(${this.primaryColor.r},${this.primaryColor.g},${this.primaryColor.b},`;
  }

  private initNeurons(): void {
    this.neurons = [];
    this.nextNeuronId = 0;
    const now = performance.now();

    for (let i = 0; i < this.seeds; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (BASE_R - 6);
      const x = CX + dist * Math.cos(angle);
      const y = CY + dist * Math.sin(angle);
      this.createNeuron(x, y, now);
    }

    for (let i = 0; i < this.neurons.length; i += 1) {
      this.sinPhase[i] = Math.sin(this.neurons[i]!.phase);
      this.cosPhase[i] = Math.cos(this.neurons[i]!.phase);
      this.prevSinPhase[i] = this.sinPhase[i]!;
    }
  }

  private createNeuron(x: number, y: number, now: number): Neuron {
    const nf = 0.0008 + Math.random() * 0.0017;
    const targetR = 2.0 + Math.random() * 2.4;
    const neuron: Neuron = {
      x,
      y,
      baseX: x,
      baseY: y,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      freqX: 0.0003 + Math.random() * 0.0004,
      freqY: 0.00025 + Math.random() * 0.00035,
      ampX: 12 + Math.random() * 24,
      ampY: 12 + Math.random() * 24,
      radius: 0,
      opacity: 0,
      glowRadius: 0,
      driftVx: (Math.random() - 0.5) * 0.02,
      driftVy: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2,
      naturalFreq: nf,
      freqTarget: nf,
      id: this.nextNeuronId++,
      birthTime: now,
      maturity: 0,
      targetRadius: targetR,
      targetOpacity: 0.4 + Math.random() * 0.5,
      targetGlowRadius: targetR * 1.6 + Math.random() * 1.5,
      trace: 0,
    };
    this.neurons.push(neuron);
    return neuron;
  }

  private updateNeurogenesis(now: number): void {
    for (const n of this.neurons) {
      const age = now - n.birthTime;
      n.maturity = 1 - Math.exp(-age / TAU_MATURE);
      n.radius = n.targetRadius * n.maturity;
      n.opacity = n.targetOpacity * n.maturity;
      n.glowRadius = n.targetGlowRadius * n.maturity;
    }
  }

  private spawnNeuron(now: number): void {
    if (this.neurons.length >= MAX_N) return;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (BASE_R - 10);
    const x = CX + dist * Math.cos(angle);
    const y = CY + dist * Math.sin(angle);
    this.createNeuron(x, y, now);
  }

  private updateSTDP(dt: number): void {
    const nCount = this.neurons.length;

    for (let i = 0; i < nCount; i += 1) {
      const n = this.neurons[i]!;
      n.trace *= Math.exp(-dt / STDP_TAU);
      if (this.prevSinPhase[i]! < 0 && this.sinPhase[i]! >= 0) {
        n.trace += 1.0;
      }
    }

    for (const conn of this.connections.values()) {
      if (conn.i >= nCount || conn.j >= nCount) continue;
      const ni = this.neurons[conn.i]!;
      const nj = this.neurons[conn.j]!;

      if (this.prevSinPhase[conn.i]! < 0 && this.sinPhase[conn.i]! >= 0) {
        conn.weight = Math.max(0, conn.weight - STDP_A_MINUS * nj.trace);
      }
      if (this.prevSinPhase[conn.j]! < 0 && this.sinPhase[conn.j]! >= 0) {
        conn.weight = Math.min(1, conn.weight + STDP_A_PLUS * ni.trace);
      }
    }
  }

  private computeBlobPath(t: number): Path2D {
    const p = new Path2D();
    const step = (Math.PI * 2) / BLOB_PTS;
    const harmonicWt = HARMONICS.map(
      (h) => h.speed * t + 0.3 * Math.sin(t * h.speed * 0.37 + h.phase * 2.1),
    );

    for (let i = 0; i <= BLOB_PTS; i += 1) {
      const theta = i * step;

      let r = BASE_R;
      for (let hIdx = 0; hIdx < HARMONICS.length; hIdx += 1) {
        const h = HARMONICS[hIdx]!;
        r += h.amp * Math.sin(h.n * theta + harmonicWt[hIdx]! + h.phase);
      }

      const x = CX + r * Math.cos(theta);
      const y = CY + r * Math.sin(theta);
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    }

    p.closePath();
    return p;
  }

  private syncRAF(): void {
    if (this.isVisible && this.tabVisible) this.startRAF();
    else this.stopRAF();
  }

  private startRAF(): void {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(this.draw);
  }

  private stopRAF(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private draw = (timestamp: number): void => {
    const ctx = this.ctx;
    if (!ctx) return;

    const dt = this.lastDrawTime > 0 ? Math.min(timestamp - this.lastDrawTime, 50) : 16;
    this.lastDrawTime = timestamp;
    const now = performance.now();
    const dtNorm = dt / 16;

    const { r, g, b } = this.primaryColor;

    const prevNCount = this.neurons.length;
    for (let i = 0; i < prevNCount; i += 1) {
      this.prevSinPhase[i] = this.sinPhase[i]!;
    }

    this.updateNeurogenesis(now);

    const nCount = this.neurons.length;

    for (let i = 0; i < nCount; i += 1) {
      const pi = this.neurons[i]!;

      pi.phase += pi.naturalFreq * dt;

      pi.naturalFreq += (pi.freqTarget - pi.naturalFreq) * 0.0005 * dtNorm;
      if (Math.abs(pi.naturalFreq - pi.freqTarget) < 0.0001) {
        pi.freqTarget = 0.0008 + Math.random() * 0.0017;
      }

      for (let j = 0; j < nCount; j += 1) {
        if (i === j) continue;
        const pj = this.neurons[j]!;
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const ki = Math.min(i, j);
          const kj = Math.max(i, j);
          const key = ki * MAX_N + kj;
          const conn = this.connections.get(key);
          const k = conn ? conn.coupling : COUPLING;
          pi.phase +=
            (1 - dist / CONNECT_DIST) *
            k *
            pi.maturity *
            pj.maturity *
            dt *
            Math.sin(pj.phase - pi.phase);
        }
      }
    }

    for (let i = 0; i < nCount; i += 1) {
      this.sinPhase[i] = Math.sin(this.neurons[i]!.phase);
      this.cosPhase[i] = Math.cos(this.neurons[i]!.phase);
    }

    this.updateSTDP(dt);

    const harmonicWt = HARMONICS.map(
      (h) => h.speed * timestamp + 0.3 * Math.sin(timestamp * h.speed * 0.37 + h.phase * 2.1),
    );

    for (const p of this.neurons) {
      p.driftVx += (Math.random() - 0.5) * 0.008;
      p.driftVy += (Math.random() - 0.5) * 0.008;
      p.driftVx *= 0.98;
      p.driftVy *= 0.98;
      p.baseX += p.driftVx * dtNorm;
      p.baseY += p.driftVy * dtNorm;

      const dbx = p.baseX - CX;
      const dby = p.baseY - CY;
      const bd = Math.sqrt(dbx * dbx + dby * dby);
      if (bd > BASE_R - 6) {
        const s = (BASE_R - 6) / bd;
        p.baseX = CX + dbx * s;
        p.baseY = CY + dby * s;
        p.driftVx *= -0.5;
        p.driftVy *= -0.5;
      }

      p.x = p.baseX + p.ampX * Math.sin(p.freqX * timestamp + p.phaseX);
      p.y = p.baseY + p.ampY * Math.sin(p.freqY * timestamp + p.phaseY);

      const dx = p.x - CX;
      const dy = p.y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const theta = Math.atan2(dy, dx);
        let blobR = BASE_R;
        for (let hIdx = 0; hIdx < HARMONICS.length; hIdx += 1) {
          const h = HARMONICS[hIdx]!;
          blobR += h.amp * Math.sin(h.n * theta + harmonicWt[hIdx]! + h.phase);
        }
        const maxR = blobR - 6;
        if (dist > maxR) {
          const s = maxR / dist;
          p.x = CX + dx * s;
          p.y = CY + dy * s;
        }
      }
    }

    this.activeKeys.clear();
    for (let i = 0; i < nCount; i += 1) {
      for (let j = i + 1; j < nCount; j += 1) {
        const dx = this.neurons[i]!.x - this.neurons[j]!.x;
        const dy = this.neurons[i]!.y - this.neurons[j]!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const key = i * MAX_N + j;
          this.activeKeys.add(key);
          let conn = this.connections.get(key);
          if (!conn) {
            conn = {
              i,
              j,
              alpha: 0,
              cpx: (Math.random() - 0.5) * 6,
              cpy: (Math.random() - 0.5) * 6,
              cpvx: (Math.random() - 0.5) * 0.01,
              cpvy: (Math.random() - 0.5) * 0.01,
              weight: 0.3,
              coupling: COUPLING,
            };
            this.connections.set(key, conn);
          }
          const target = 1 - dist / CONNECT_DIST;
          conn.alpha += (target - conn.alpha) * 0.08 * dtNorm;

          const phaseDiff = this.neurons[i]!.phase - this.neurons[j]!.phase;
          conn.coupling +=
            HEBBIAN_EPSILON * dt * (HEBBIAN_ALPHA * Math.cos(phaseDiff) - conn.coupling);
          conn.coupling = Math.max(0, Math.min(1, conn.coupling));
        }
      }
    }

    for (const [key, conn] of this.connections) {
      conn.cpvx += (Math.random() - 0.5) * 0.02;
      conn.cpvy += (Math.random() - 0.5) * 0.02;
      conn.cpvx *= 0.95;
      conn.cpvy *= 0.95;
      conn.cpx += conn.cpvx * dtNorm;
      conn.cpy += conn.cpvy * dtNorm;
      const cm = Math.sqrt(conn.cpx * conn.cpx + conn.cpy * conn.cpy);
      if (cm > 15) {
        conn.cpx *= 15 / cm;
        conn.cpy *= 15 / cm;
      }

      if (!this.activeKeys.has(key)) {
        conn.alpha -= FADE_RATE * dt;
        if (conn.alpha <= 0) this.connections.delete(key);
      }
    }

    let sumCos = 0;
    let sumSin = 0;
    for (let i = 0; i < nCount; i += 1) {
      sumCos += this.cosPhase[i]!;
      sumSin += this.sinPhase[i]!;
    }
    const coherence = nCount > 0 ? Math.sqrt(sumCos * sumCos + sumSin * sumSin) / nCount : 0;

    ctx.clearRect(0, 0, W, H);

    const blob = this.computeBlobPath(timestamp);

    ctx.fillStyle = this.rgbaPrefix + (0.03 + coherence * 0.04).toFixed(3) + ')';
    ctx.fill(blob);

    ctx.save();
    ctx.clip(blob);

    for (const conn of this.connections.values()) {
      if (conn.alpha < 0.01) continue;
      if (conn.i >= nCount || conn.j >= nCount) continue;
      const pi = this.neurons[conn.i]!;
      const pj = this.neurons[conn.j]!;

      const phaseAlign = 0.5 + 0.5 * Math.cos(pi.phase - pj.phase);
      const meanBright = 0.5 * (Math.sin(pi.phase) + Math.sin(pj.phase)) * 0.5 + 0.5;

      const alpha = Math.min(1, conn.alpha * (0.15 + phaseAlign * 0.5) * (0.5 + meanBright));
      const mx = (pi.x + pj.x) / 2;
      const my = (pi.y + pj.y) / 2;

      ctx.beginPath();
      ctx.moveTo(pi.x, pi.y);
      ctx.quadraticCurveTo(mx + conn.cpx, my + conn.cpy, pj.x, pj.y);
      ctx.strokeStyle = this.rgbaPrefix + alpha.toFixed(3) + ')';
      ctx.lineWidth = conn.alpha * (0.6 + phaseAlign * 1.0);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < nCount; i += 1) {
      const p = this.neurons[i]!;
      if (p.opacity < 0.01) continue;

      const brightness = 0.5 + 0.5 * this.sinPhase[i]!;
      const glow = p.glowRadius * (0.8 + brightness * 0.4);

      const warmth = brightness * brightness * brightness * 0.25;
      const pr = Math.min(255, r + 50 * warmth) | 0;
      const pg = Math.min(255, g + 35 * warmth) | 0;
      const pb = Math.min(255, b + 15 * warmth) | 0;

      if (glow > 0.1) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        grad.addColorStop(
          0,
          `rgba(${pr},${pg},${pb},${(p.opacity * 0.4 * (0.5 + brightness * 0.5)).toFixed(2)})`,
        );
        grad.addColorStop(1, this.rgbaPrefix + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.radius > 0.05) {
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${(p.opacity * (0.5 + brightness * 0.5)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    const breathPhase = (timestamp % 4000) / 4000;
    const tidal = 0.85 + 0.15 * Math.sin(timestamp * 0.00007);
    const breathe = breathEase(breathPhase) * tidal;
    const coherenceGlow = coherence * coherence * 0.3;

    ctx.shadowBlur = 6 + (breathe + coherenceGlow) * 14;
    ctx.shadowColor = this.rgbaPrefix + (0.15 + (breathe + coherenceGlow) * 0.25).toFixed(2) + ')';
    ctx.strokeStyle = this.rgbaPrefix + (0.18 + breathe * 0.14).toFixed(2) + ')';
    ctx.lineWidth = 1;
    ctx.stroke(blob);

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // Autonomous growth — gentle drift toward a resting population.
    const restingPop = 10;
    if (nCount < MAX_N) {
      const hunger = Math.max(0, 1 - nCount / restingPop);
      const chance = 0.002 + hunger * 0.008;
      if (Math.random() < chance) {
        this.spawnNeuron(now);
      }
    }

    this.rafId = requestAnimationFrame(this.draw);
  };

  override render() {
    return html`<div ${ref(this.wrapperRef)}></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schmancy-thinking-bubble': SchmancyThinkingBubble;
  }
}
