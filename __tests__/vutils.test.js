function createVector(x = 0, y = 0) {
  return {
    x,
    y,
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    sub(v) {
      return createVector(this.x - v.x, this.y - v.y);
    },
    dot(v) {
      return this.x * v.x + this.y * v.y;
    },
    heading() {
      return Math.atan2(this.y, this.x);
    },
  };
}

global.createVector = createVector;
global.cos = Math.cos;
global.sin = Math.sin;
global.constrain = (value, min, max) => Math.max(min, Math.min(max, value));
global.p5 = {
  Vector: {
    mult(vec, scalar) {
      return createVector(vec.x * scalar, vec.y * scalar);
    },
    sub(vec, other) {
      return createVector(vec.x - other.x, vec.y - other.y);
    },
  },
};

const { VUtils } = require("../gameObject.js");

describe("VUtils", () => {
  test("ortho2 devuelve un vector ortogonal rotado 90 grados", () => {
    const v = createVector(2, 3);
    const ortho = VUtils.ortho2(v);
    expect(ortho.x).toBe(-3);
    expect(ortho.y).toBe(2);
    expect(v.dot(ortho)).toBeCloseTo(0);
  });

  test("linear combina vectores con los escalares provistos", () => {
    const v1 = createVector(1, 0);
    const v2 = createVector(0, 1);
    const v3 = createVector(2, 2);
    const result = VUtils.linear([v1, v2, v3], [2, 3, -1]);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });

  test("linear combina vectores con los escalares provistos", () => {
    const result = VUtils.linear([], []);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  test("base2std transforma coordenadas de base a estándar", () => {
    const b1 = createVector(1, 0);
    const b2 = createVector(0, 1);
    const alpha = createVector(4, -2);
    const std = VUtils.base2std(b1, b2, alpha);
    expect(std.x).toBe(4);
    expect(std.y).toBe(-2);
  });

  test("std2orthobase proyecta a la base ortonormal", () => {
    const b1 = createVector(1, 0);
    const b2 = createVector(0, 1);
    const std = createVector(3, 5);
    const coords = VUtils.std2orthobase(b1, b2, std);
    expect(coords.x).toBeCloseTo(3);
    expect(coords.y).toBeCloseTo(5);
  });

  test("rotate aplica una rotación antihoraria", () => {
    const v = createVector(1, 0);
    const rotated = VUtils.rotate(v, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
  });

  test("clamp restringe cada componente dentro del rango", () => {
    const v = createVector(5, -3);
    const clamped = VUtils.clamp(v, -1, 2);
    expect(clamped.x).toBe(2);
    expect(clamped.y).toBe(-1);
  });

  test("std2orthobase seguido de base2std devuelve el vector original", () => {
    const b1 = createVector(0, 1);
    const b2 = createVector(-1, 0);
    const std = createVector(4, -6);
    const coords = VUtils.std2orthobase(b1, b2, std);
    const rebuilt = VUtils.base2std(b1, b2, coords);
    expect(rebuilt.x).toBeCloseTo(std.x, 5);
    expect(rebuilt.y).toBeCloseTo(std.y, 5);
  });

  test("linear con base ortonormal replica base2std", () => {
    const basis = [createVector(1, 0), createVector(0, 1)];
    const alpha = createVector(3, 7);
    const combo = VUtils.linear(basis, [alpha.x, alpha.y]);
    const base2std = VUtils.base2std(basis[0], basis[1], alpha);
    expect(combo.x).toBe(base2std.x);
    expect(combo.y).toBe(base2std.y);
  });
});
