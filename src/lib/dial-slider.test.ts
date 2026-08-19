import { describe, expect, test } from "bun:test";

import {
  clamp,
  decimalsForStep,
  formatDialValue,
  hashMarkPercents,
  percentFromValue,
  roundValue,
  snapClickValue,
  snapToDecile,
} from "./dial-slider";

describe("dial-slider", () => {
  test("decimalsForStep counts digits after the decimal", () => {
    expect(decimalsForStep(1)).toBe(0);
    expect(decimalsForStep(500)).toBe(0);
    expect(decimalsForStep(0.01)).toBe(2);
    expect(decimalsForStep(0.005)).toBe(3);
  });

  test("roundValue snaps to the step without float residue", () => {
    expect(roundValue(1.234, 0.01)).toBe(1.23);
    expect(roundValue(16012, 500)).toBe(16000);
    expect(roundValue(0.127, 0.005)).toBe(0.125);
  });

  test("snapToDecile only snaps when close to a 10% tick", () => {
    expect(snapToDecile(0.51, 0, 1)).toBe(0.5);
    expect(snapToDecile(0.2, 0, 1)).toBe(0.2);
    expect(snapToDecile(0.44, 0, 1)).toBe(0.44);
  });

  test("snapClickValue uses steps when the range is coarse", () => {
    expect(snapClickValue(7.2, 0, 10, 1)).toBe(7);
    expect(snapClickValue(0.62, 0, 1, 0.01)).toBe(0.6);
  });

  test("formatDialValue matches the step precision", () => {
    expect(formatDialValue(1, 0.01)).toBe("1.00");
    expect(formatDialValue(16000, 500)).toBe("16000");
  });

  test("percentFromValue and clamp stay in range", () => {
    expect(percentFromValue(25, 0, 100)).toBe(25);
    expect(percentFromValue(10, 10, 10)).toBe(0);
    expect(clamp(-2, 0, 1)).toBe(0);
    expect(clamp(4, 0, 1)).toBe(1);
  });

  test("hashMarkPercents uses steps for coarse ranges and deciles otherwise", () => {
    expect(hashMarkPercents(0, 4, 1)).toEqual([25, 50, 75]);
    expect(hashMarkPercents(0, 1, 0.01)).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90]);
  });
});
