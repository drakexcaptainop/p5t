const { BoundingPrimitive, Ray } = require("../primitives.js");
const { Transform2d } = require("../gameObject.js");

function createVector(x = 0, y = 0) {
  return {
    x,
    y,
    add(v) { this.x += v.x; this.y += v.y; return this; },
    sub(v) { return createVector(this.x - v.x, this.y - v.y); },
    dot(v) { return this.x * v.x + this.y * v.y; },
    mult(s) { return createVector(this.x * s, this.y * s); },
  };
}

global.createVector = createVector;
global.p5 = {
  Vector: {
    mult: (v, s) => createVector(v.x * s, v.y * s),
    sub: (a, b) => createVector(a.x - b.x, a.y - b.y)
  }
};

describe("BoundingPrimitive - creación y transformaciones", () => {
  test("debe crearse correctamente con un Transform2d", () => {
    const t = new Transform2d(createVector(10, 5));
    const bp = new BoundingPrimitive(t);
    expect(bp.transform).toBe(t);
  });

  test("transformRay2Base() devuelve un Ray en base local", () => {
    const t = new Transform2d(createVector(0, 0));
    const bp = new BoundingPrimitive(t);
    const rayStd = new Ray(createVector(1, 1), createVector(0, -1));
    const rayBase = bp.transformRay2Base(rayStd);
    expect(rayBase).toBeInstanceOf(Ray);
    expect(rayBase).not.toBe(rayStd);
  });

  test("transformRay2Std() devuelve un Ray en coordenadas estándar", () => {
    const t = new Transform2d(createVector(0, 0));
    const bp = new BoundingPrimitive(t);
    const rayBase = new Ray(createVector(2, 3), createVector(1, 0));
    const rayStd = bp.transformRay2Std(rayBase);
    expect(rayStd).toBeInstanceOf(Ray);
    expect(rayStd.r0).toHaveProperty("x");
    expect(rayStd.rd).toHaveProperty("x");
  });

  test("valida que el origen y dirección transformados sean correctos en un caso simple", () => {
    const t = new Transform2d(createVector(0, 0));
    const bp = new BoundingPrimitive(t);
    const ray = new Ray(createVector(0, 0), createVector(0, -1));
    const rayBase = bp.transformRay2Base(ray);
    const rayStd = bp.transformRay2Std(rayBase);
    expect(rayStd.r0.x).toBeCloseTo(ray.r0.x, 6);
    expect(rayStd.r0.y).toBeCloseTo(ray.r0.y, 6);
    expect(rayStd.rd.x).toBeCloseTo(ray.rd.x, 6);
    expect(rayStd.rd.y).toBeCloseTo(ray.rd.y, 6);
  });
});
