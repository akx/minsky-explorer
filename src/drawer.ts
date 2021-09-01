export interface Settings {
  initial: { x: number; y: number };
  delta: { x: number; y: number };
  scale: { x: number; y: number };
  alpha: number;
  initialEps: number;
  iterations: number;
  epsDelta: number;
  round: boolean;
  baseDotSize: number;
  velocityToDotSize: number;
  color: string;
}

export const epsScale = 100000;

export const settingsSchema = {
  initial: { value: { x: 150, y: 110 }, step: 1 },
  delta: { value: { x: 0, y: 0 }, step: 0.1 },
  scale: { value: { x: 0, y: 0 }, step: 0.001 },
  baseDotSize: { value: 4, min: 0, max: 50 },
  velocityToDotSize: { min: -100, max: 100, value: 0 },
  initialEps: {
    min: -5 * epsScale,
    max: +5 * epsScale,
    value: 0.04 * epsScale,
    step: 1,
  },
  epsDelta: {
    min: -0.001 * epsScale,
    max: +0.001 * epsScale,
    value: 0.0001 * epsScale,
    step: 1,
  },
  iterations: { value: 20000, min: 100, max: 1000000 },
  round: false,
  color: "orange",
  alpha: { value: 0.05, min: 0, max: 0.3, step: 0.001 },
};

function identity<T>(v: T): T {
  return v;
}

export function draw(canvas: HTMLCanvasElement, settings: Settings) {
  const {
    initial,
    delta,
    scale,
    alpha,
    initialEps,
    epsDelta,
    round,
    iterations,
    baseDotSize,
    velocityToDotSize,
    color,
  } = settings;
  const { x: dx, y: dy } = delta;
  const { x: sx, y: sy } = scale;
  let { x, y } = initial;
  let eps = initialEps / epsScale;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "lighter";
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const rounder = round ? Math.round : identity;
  let lastX = x;
  let lastY = y;
  for (let i = 0; i < iterations; i++) {
    const dotSize =
      baseDotSize +
      (Math.hypot(lastX - x, lastY - y) * velocityToDotSize) / 1000;
    ctx.fillRect(
      centerX + x - dotSize / 2,
      centerY + y - dotSize / 2,
      dotSize,
      dotSize,
    );
    lastX = x;
    lastY = y;
    x = rounder(x - y * eps);
    y = rounder(y + x * eps);
    x = rounder((x + dx) * (1 + sx * 0.01));
    y = rounder((y + dy) * (1 + sy * 0.01));
    eps += epsDelta / epsScale;
  }
}
