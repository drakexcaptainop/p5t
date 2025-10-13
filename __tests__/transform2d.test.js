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

const { Transform2d } = require("../gameObject.js");

describe("Transform2d", () => {
  test("guarda la posición inicial proporcionada", () => {
    const pos = createVector(5, 10);
    const t = new Transform2d(pos);
    expect(t.pos).toBe(pos);
    expect(t.pos.x).toBe(5);
    expect(t.pos.y).toBe(10);
  });

  test("fwd se asigna correctamente por defecto (0, -1)", () => {
    const t = new Transform2d(createVector(0, 0));
    expect(t.fwd.x).toBe(0);
    expect(t.fwd.y).toBe(-1);
    expect(t.right.x).toBe(1);
    expect(t.right.y).toBe(0);
  });

  test("acepta un vector forward personalizado y calcula right ortogonal", () => {
    const fwd = createVector(0, 1);
    const t = new Transform2d(createVector(0, 0), fwd);
    expect(t.fwd).toBe(fwd);
    expect(t.right.x).toBe(-1);
    expect(t.right.y).toBe(0);
  });

  test("translate usa la base local por defecto", () => {
    const t = new Transform2d(createVector(0, 0));
    t.translate(createVector(1, 2));
    expect(t.pos.x).toBe(1);
    expect(t.pos.y).toBe(-2);
  });

  test("translate con useStandardBasis true usa el vector estándar", () => {
    const t = new Transform2d(createVector(1, 1));
    t.translate(createVector(2, 3), true);
    expect(t.pos.x).toBe(3);
    expect(t.pos.y).toBe(4);
  });

  test("rotate actualiza la orientación y el ángulo zrot", () => {
    const t = new Transform2d(createVector(0, 0));
    t.rotate(Math.PI / 2);
    expect(t.fwd.x).toBeCloseTo(1, 5);
    expect(t.fwd.y).toBeCloseTo(0, 5);
    expect(t.right.x).toBeCloseTo(0, 5);
    expect(t.right.y).toBeCloseTo(1, 5);
    expect(t.zrot).toBeCloseTo(t.right.heading(), 5);
  });

  test("base2Std y std2Base son operaciones inversas", () => {
    const t = new Transform2d(createVector(0, 0));
    const baseCoords = createVector(2, 3);
    const stdVector = t.base2Std(baseCoords);
    expect(stdVector.x).toBe(2);
    expect(stdVector.y).toBe(-3);
    const recovered = t.std2Base(stdVector);
    expect(recovered.x).toBeCloseTo(baseCoords.x, 5);
    expect(recovered.y).toBeCloseTo(baseCoords.y, 5);
  });

  test("transformStd2Base y transformBase2Std respetan el origen de la transformada", () => {
    const t = new Transform2d(createVector(5, 5));
    const point = createVector(7, 2);
    const toBase = t.transformStd2Base(point);
    expect(toBase.x).toBe(2);
    expect(toBase.y).toBe(3);
    const backToStd = t.transformBase2Std(toBase, true);
    expect(backToStd.x).toBeCloseTo(point.x, 5);
    expect(backToStd.y).toBeCloseTo(point.y, 5);
  });

  test("translate usa la base local por defecto", () => {
  const t = new Transform2d(createVector(0, 0));
  t.translate(createVector(1, 2));
  expect(t.pos.x).toBe(1);
  expect(t.pos.y).toBe(-2);
  });

  


});
