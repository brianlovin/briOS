/** Math helpers for DialKit-style sliders. */

export function decimalsForStep(step: number): number {
  const text = step.toString();
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

export function roundValue(value: number, step: number): number {
  if (step <= 0) return value;
  const rounded = Math.round(value / step) * step;
  return parseFloat(rounded.toFixed(decimalsForStep(step)));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function percentFromValue(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

/** Snap to the nearest 10% tick when the pointer is close enough. */
export function snapToDecile(rawValue: number, min: number, max: number): number {
  const range = max - min;
  if (range === 0) return min;
  const normalized = (rawValue - min) / range;
  const nearest = Math.round(normalized * 10) / 10;
  if (Math.abs(normalized - nearest) <= 0.03125) {
    return min + nearest * range;
  }
  return rawValue;
}

/** Click-to-snap: coarse ranges snap to steps; finer ranges snap to nearby deciles. */
export function snapClickValue(rawValue: number, min: number, max: number, step: number): number {
  if (step <= 0 || max === min) return clamp(rawValue, min, max);
  const discreteSteps = (max - min) / step;
  if (discreteSteps <= 10) {
    return clamp(min + Math.round((rawValue - min) / step) * step, min, max);
  }
  return snapToDecile(rawValue, min, max);
}

export function formatDialValue(value: number, step: number): string {
  return value.toFixed(decimalsForStep(step));
}

export function hashMarkPercents(min: number, max: number, step: number): number[] {
  const range = max - min;
  if (range <= 0 || step <= 0) return [];
  const discreteSteps = range / step;
  if (discreteSteps <= 10) {
    return Array.from({ length: Math.max(0, Math.round(discreteSteps) - 1) }, (_, index) => {
      return (((index + 1) * step) / range) * 100;
    });
  }
  return [10, 20, 30, 40, 50, 60, 70, 80, 90];
}
