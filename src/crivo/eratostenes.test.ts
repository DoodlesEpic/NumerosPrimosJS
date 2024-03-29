import { describe, expect, test } from "vitest";
import crivoEratostenes from "./eratostenes";

describe("crivoEratostenes é correto com", () => {
  test("números padrões", () => {
    expect(crivoEratostenes(100)).toEqual([
      [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97,
      ],
      [
        0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 8, 8, 8, 8, 9, 9,
        9, 9, 9, 9, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 14,
        14, 14, 14, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 17, 17, 18,
        18, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 21, 21, 21, 21, 21, 21, 22,
        22, 22, 22, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 25,
        25, 25,
      ],
    ]);
    expect(crivoEratostenes(10)).toEqual([
      [2, 3, 5, 7],
      [0, 1, 2, 2, 3, 3, 4, 4, 4],
    ]);
  });

  test("números pequenos", () => {
    expect(crivoEratostenes(3)).toEqual([[2], [0, 1]]);
    expect(crivoEratostenes(2)).toEqual([[], [0]]);
  });

  test("zero", () => {
    expect(() => crivoEratostenes(0)).toThrowError("Número não pode ser 0");
  });

  test("números negativos pequenos", () => {
    expect(() => crivoEratostenes(-3)).toThrowError(
      "Número não pode ser negativo"
    );
    expect(() => crivoEratostenes(-2)).toThrowError(
      "Número não pode ser negativo"
    );
  });

  test("números negativos", () => {
    expect(() => crivoEratostenes(-50)).toThrowError(
      "Número não pode ser negativo"
    );
    expect(() => crivoEratostenes(-100)).toThrowError(
      "Número não pode ser negativo"
    );
  });
});
