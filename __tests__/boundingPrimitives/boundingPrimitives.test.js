// BoundingPrimitives.test.js
const { Ray, BoundingPrimitive, BSpherical, BB } = require('../../primitives');

describe('Bounding primitives (métodos sin bucles ni if)', () => {
  const makeVec = (x = 0, y = 0, z = 0) => ({
    x, y, z,
    add(v) { return makeVec(this.x + (v.x ?? 0), this.y + (v.y ?? 0), this.z + (v.z ?? 0)); },
    sub(v) { return makeVec(this.x - (v.x ?? 0), this.y - (v.y ?? 0), this.z - (v.z ?? 0)); },
    dot(v) { return this.x * (v.x ?? 0) + this.y * (v.y ?? 0) + this.z * (v.z ?? 0); },
    mag() { return Math.hypot(this.x, this.y, this.z); },
    normalize() {
      const n = this.mag() || 1;
      return makeVec(this.x / n, this.y / n, this.z / n);
    },
    mult(t) { return makeVec(this.x * t, this.y * t, this.z * t); },
  });

  beforeAll(() => {
    global.p5 = {
      Vector: {
        mult: (v, t) => makeVec((v.x ?? 0) * t, (v.y ?? 0) * t, (v.z ?? 0) * t),
        sub:  (a, b) => makeVec((a.x ?? 0) - (b.x ?? 0), (a.y ?? 0) - (b.y ?? 0), (a.z ?? 0) - (b.z ?? 0)),
      },
    };
    global.createVector = (x = 0, y = 0, z = 0) => makeVec(x, y, z);
    global.constrain = (val, min, max) => Math.min(max, Math.max(min, val));
    global.PRIMITIVE_GLOBALS = { Eps: 1e-6 };
  });

  describe('BoundingPrimitive', () => {
    test('constructor asigna transform', () => {
      const transform = {};
      const bp = new BoundingPrimitive(transform);
      expect(bp.transform).toBe(transform);
    });

    test('transformRay2Base', () => {
      const transform = {
        transformStd2Base: (v, isDir) => isDir
          ? makeVec((v.x ?? 0) * 2, (v.y ?? 0) * 2, (v.z ?? 0) * 2)
          : makeVec((v.x ?? 0) + 10, (v.y ?? 0) + 20, (v.z ?? 0) + 30),
      };
      const bp = new BoundingPrimitive(transform);

      const r0 = makeVec(1, 2, 3);
      const rd = makeVec(3, 4, 5);
      rd.dot = v => r0.x * v.x + r0.y * v.y + r0.z * v.z;
      const ray = new Ray(r0, rd);

      const rB = bp.transformRay2Base(ray);
      expect({ x: rB.r0.x, y: rB.r0.y, z: rB.r0.z }).toEqual({ x: 11, y: 22, z: 33 });
      expect({ x: rB.rd.x, y: rB.rd.y, z: rB.rd.z }).toEqual({ x: 6, y: 8, z: 10 });
    });

    test('transformRay2Std', () => {
      const transform = {
        transformBase2Std: (v, isPoint) => isPoint
          ? makeVec((v.x ?? 0) + 1, (v.y ?? 0) + 2, (v.z ?? 0) + 3)
          : makeVec((v.x ?? 0) - 1, (v.y ?? 0) - 2, (v.z ?? 0) - 3),
      };
      const bp = new BoundingPrimitive(transform);

      const r0 = makeVec(0, 0, 0);
      const rd = makeVec(10, 20, 30);
      rd.dot = v => rd.x * v.x + rd.y * v.y + rd.z * v.z;
      const ray = new Ray(r0, rd);

      const rS = bp.transformRay2Std(ray);
      expect({ x: rS.r0.x, y: rS.r0.y, z: rS.r0.z }).toEqual({ x: 1, y: 2, z: 3 });
      expect({ x: rS.rd.x, y: rS.rd.y, z: rS.rd.z }).toEqual({ x: 9, y: 18, z: 27 });
    });
  });

  describe('BSpherical', () => {
    test('constructor guarda radio y transform', () => {
      const transform = { pos: makeVec(0, 0, 0) };
      const b = new BSpherical(7, transform);
      expect(b.rad).toBe(7);
      expect(b.transform).toBe(transform);
    });

    test('checkHit devuelve [hasHit, P]', () => {
      const transform = { pos: makeVec(5, 0, 0) };
      const sph = new BSpherical(1, transform);
      const r0 = makeVec(0, 0, 0);
      const rd = makeVec(1, 0, 0);
      rd.dot = v => rd.x * v.x + rd.y * v.y + rd.z * v.z;
      const ray = new Ray(r0, rd);

      const [hasHit, P] = sph.checkHit(ray);
      expect(hasHit).toBe(true);
      expect({ x: P.x, y: P.y, z: P.z }).toEqual({ x: 4, y: 0, z: 0 });
    });

    test('getClosest retorna punto más cercano', () => {
      const transform = { pos: makeVec(0, 0, 0) };
      const sph = new BSpherical(2, transform);
      const P = makeVec(5, 0, 0);
      const Pt = sph.getClosest(P);
      expect({ x: Pt.x, y: Pt.y, z: Pt.z }).toEqual({ x: 3, y: 0, z: 0 });
    });
  });

  describe('BB', () => {
    test('constructor inicializa correctamente', () => {
      const transform = { pos: makeVec(0, 0, 0) };
      const bb = new BB(transform, 8);
      expect(bb.width).toBe(8);
      expect(bb.height).toBe(8);
      expect(bb.widthd2).toBe(4);
      expect(bb.heightd2).toBe(4);
    });

    test('rightCorner', () => {
      const transform = { pos: makeVec(1, 2, 0) };
      const bb = new BB(transform, 4, 6);
      const rc = bb.rightCorner;
      expect({ x: rc.x, y: rc.y, z: rc.z }).toEqual({ x: 3, y: 5, z: 0 });
    });

    test('corner', () => {
      const transform = { pos: makeVec(10, -2, 0) };
      const bb = new BB(transform, 4, 6);
      const c = bb.corner;
      expect({ x: c.x, y: c.y, z: c.z }).toEqual({ x: 8, y: -5, z: 0 });
    });

    test('slabTest2 retorna hit y punto correcto', () => {
      const transform = { pos: makeVec(0, 0, 0), transformBase2Std: v => v };
      const bb = new BB(transform, 4, 4);
      const r0 = makeVec(-10, 0, 0);
      const rd = makeVec(1, 0.1, 0);
      rd.dot = v => rd.x * v.x + rd.y * v.y + rd.z * v.z;
      const ray = new Ray(r0, rd);
      const [hit, P] = bb.slabTest2(ray);
      expect(hit).toBe(true);
      expect({ x: P.x, y: P.y, z: P.z }).toEqual({ x: -2, y: 0.8, z: 0 });
    });

    test('checkHit llama transformRay2Base y slabTest2', () => {
      const transform = {
        pos: makeVec(0, 0, 0),
        transformStd2Base: v => v,
        transformBase2Std: v => v,
      };
      const bb = new BB(transform, 4, 4);
      const ray = new Ray(makeVec(-10, 0, 0), Object.assign(makeVec(1, 0.1, 0), {
        dot(v){ return this.x*v.x + this.y*v.y + this.z*v.z; }
      }));
      const spyTransform = jest.spyOn(bb, 'transformRay2Base');
      const spySlab = jest.spyOn(bb, 'slabTest2').mockReturnValue([true, makeVec(1, 2, 0)]);
      const [hit, P] = bb.checkHit(ray);
      expect(spyTransform).toHaveBeenCalledWith(ray);
      expect(spySlab).toHaveBeenCalled();
      expect(hit).toBe(true);
      expect({ x: P.x, y: P.y, z: P.z }).toEqual({ x: 1, y: 2, z: 0 });
      spySlab.mockRestore();
    });

    test('getClosest sin transformToBase', () => {
      const transform = {
        pos: makeVec(0, 0, 0),
        transformBase2Std: v => v,
      };
      const bb = new BB(transform, 4, 6);
      const P = makeVec(5, -10, 0);
      const Q = bb.getClosest(P, false);
      expect({ x: Q.x, y: Q.y, z: Q.z }).toEqual({ x: 2, y: -3, z: 0 });
    });

    test('getClosest con transformToBase', () => {
      const transform = {
        pos: makeVec(0, 0, 0),
        transformStd2Base: v => makeVec(v.x + 1, v.y - 1, v.z),
        transformBase2Std: v => makeVec(v.x - 1, v.y + 1, v.z),
      };
      const bb = new BB(transform, 4, 6);
      const P = makeVec(2, 10, 0);
      const Q = bb.getClosest(P, true);
      expect({ x: Q.x, y: Q.y, z: Q.z }).toEqual({ x: 1, y: 4, z: 0 });
    });
  });
});