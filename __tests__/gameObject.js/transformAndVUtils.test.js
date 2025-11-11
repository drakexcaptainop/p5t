
const EPS = 1e-10;
let { Transform2d, VUtils } = require('../../gameObject'); 

describe('VUtils & Transform2d', () => {
  const makeVec = (x = 0, y = 0, z = 0) => ({
    x, y, z,
    add(v) { this.x += (v.x ?? 0); this.y += (v.y ?? 0); this.z += (v.z ?? 0); return this; },
    sub(v) { this.x -= (v.x ?? 0); this.y -= (v.y ?? 0); this.z -= (v.z ?? 0); return this; },
    dot(v) { return this.x * (v.x ?? 0) + this.y * (v.y ?? 0) + this.z * (v.z ?? 0); },
    mag() { return Math.hypot(this.x, this.y, this.z); },
    normalize() { const n = this.mag() || 1; this.x /= n; this.y /= n; this.z /= n; return this; },
    mult(t) { this.x *= t; this.y *= t; this.z *= t; return this; },
    heading() { return Math.atan2(this.y, this.x); },
    clone() { return makeVec(this.x, this.y, this.z); },
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
    global.cos = Math.cos;
    global.sin = Math.sin;

    global.GLOBALS = {
      DefaultGravity: .2,
      DefaultMass: 1,
      DefaultGOSize: 50,
      DefaultBaseDrawMag: 50,
      DefaultMaxAbsVelocity: 4
    };

    
  });

  describe('VUtils', () => {
    test('ortho2(u) retorna un vector ortogonal (−u.y, u.x)', () => {
      const u = createVector(3, 4);
      const v = VUtils.ortho2(u);
      expect({ x: v.x, y: v.y, z: v.z }).toEqual({ x: -4, y: 3, z: 0 });
      expect(Math.abs(u.dot(v))).toBeLessThan(EPS);
    });

    test('linear(vecs, alphas): combinación lineal Σ vecs[i]*alphas[i]', () => {
      const vecs = [createVector(1, 0), createVector(0, 2)];
      const alphas = [3, 0.5];
      const z = VUtils.linear(vecs, alphas);
      expect({ x: z.x, y: z.y, z: z.z }).toEqual({ x: 3, y: 1, z: 0 });
    });

    test('base2std(b1,b2,α): b1*α.x + b2*α.y', () => {
      const b1 = createVector(1, 0);
      const b2 = createVector(0, 1);
      const alpha = createVector(2, 3);
      const r = VUtils.base2std(b1, b2, alpha);
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: 2, y: 3, z: 0 });
    });

    test('std2orthobase(b1,b2,α): (b1·α, b2·α)', () => {
      const b1 = createVector(1, 0);
      const b2 = createVector(0, 1);
      const alpha = createVector(5, 7);
      const r = VUtils.std2orthobase(b1, b2, alpha);
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: 5, y: 7, z: 0 });
    });

    test('rotate(u,β): R(β) * u', () => {
      const u = createVector(2, 0);
      const beta = Math.PI / 2; // 90°
      const r = VUtils.rotate(u, beta);
      expect(r.x).toBeCloseTo(0, 10);
      expect(r.y).toBeCloseTo(2, 10);
      expect(r.z).toBeCloseTo(0, 10);
    });

    test('clamp(v,u,l): aplica constrain a cada componente', () => {
      const v = createVector(5, -3);
      const r = VUtils.clamp(v, -1, 1);
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: 1, y: -1, z: 0 });
    });
  });

  describe('Transform2d', () => {
    test('constructor(pos,fwd?): setea pos y base (fwd por defecto = (0,-1))', () => {
      const pos = createVector(10, 20);
      const T = new Transform2d(pos);
      expect({ x: T.pos.x, y: T.pos.y, z: T.pos.z }).toEqual({ x: 10, y: 20, z: 0 });
      expect({ x: T.fwd.x, y: T.fwd.y, z: T.fwd.z }).toEqual({ x: 0, y: -1, z: 0 });
      expect({ x: T.right.x, y: T.right.y, z: T.right.z }).toEqual({ x: 1, y: 0, z: 0 });
    });

    test('computeBase(fwd): actualiza fwd y right=ortho2(fwd)', () => {
      const T = new Transform2d(createVector(0, 0));
      T.computeBase(createVector(0, 1));
      expect({ x: T.fwd.x, y: T.fwd.y, z: T.fwd.z }).toEqual({ x: 0, y: 1, z: 0 });
      expect({ x: T.right.x, y: T.right.y, z: T.right.z }).toEqual({ x: -1, y: 0, z: 0 });
    });

    test('computeRot(): zrot = heading(right)', () => {
      const T = new Transform2d(createVector(0, 0));
      T.computeBase(createVector(0, 1)); 
      T.computeRot();
      expect(T.zrot).toBeCloseTo(Math.PI, 10);
    });

    test('base2Std(u): combina right y fwd con α=u', () => {
      const T = new Transform2d(createVector(0, 0), createVector(0, -1)); 
      const u = createVector(2, 3);
      const r = T.base2Std(u);
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: 2, y: -3, z: 0 });
    });

    test('std2Base(u): (right·u, fwd·u)', () => {
      const T = new Transform2d(createVector(0, 0), createVector(0, 1));
      const u = createVector(5, 7);
      const r = T.std2Base(u); 
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: -5, y: 7, z: 0 });
    });

    describe('translate(u, useStandardBasis)', () => {
      test('branch useStandardBasis=false (default): usa base2std(right,fwd,u)', () => {
        const T = new Transform2d(createVector(1, 2), createVector(0, -1)); 
        T.translate(createVector(2, 3),  false);
        expect({ x: T.pos.x, y: T.pos.y, z: T.pos.z }).toEqual({ x: 3, y: -1, z: 0 });
      });

      test('branch useStandardBasis=true: suma u directamente a pos', () => {
        const T = new Transform2d(createVector(1, 2));
        T.translate(createVector(2, 3), true);
        expect({ x: T.pos.x, y: T.pos.y, z: T.pos.z }).toEqual({ x: 3, y: 5, z: 0 });
      });
    });

    test('rotate(β): rota fwd por β y actualiza right y zrot', () => {
      const T = new Transform2d(createVector(0, 0), createVector(1, 0)); 
      T.rotate(Math.PI / 2); 
      expect(T.fwd.x).toBeCloseTo(0, 10);
      expect(T.fwd.y).toBeCloseTo(1, 10);
      expect(T.right.x).toBeCloseTo(-1, 10);
      expect(T.right.y).toBeCloseTo(0, 10);
      expect(T.zrot).toBeCloseTo(Math.PI, 10);
    });

    describe('transformStd2Base(P, onOrigin)', () => {
      test('branch onOrigin=true: usa P directamente (no resta pos)', () => {
        const T = new Transform2d(createVector(2, 3), createVector(0, 1)); 
        const P = createVector(5, 7);
        const q = T.transformStd2Base(P,  true);
          expect({ x: q.x, y: q.y, z: q.z }).toEqual({ x: -5, y: 7, z: 0 });
      });

      test('branch onOrigin=false: usa P - pos', () => {
        const T = new Transform2d(createVector(2, 3), createVector(1, 0)); 
        const P = createVector(5, 7);
        const q = T.transformStd2Base(P,  false);
        expect({ x: q.x, y: q.y, z: q.z }).toEqual({ x: 4, y: 3, z: 0 });
      });
    });

    describe('transformBase2Std(P, useStdOrigin)', () => {
      test('branch useStdOrigin=false: retorna q en base estándar SIN sumar pos', () => {
        const T = new Transform2d(createVector(10, 20), createVector(0, -1)); // right=(1,0), fwd=(0,-1)
        const P = createVector(2, 3);
        const q = T.transformBase2Std(P, false);
        expect({ x: q.x, y: q.y, z: q.z }).toEqual({ x: 2, y: -3, z: 0 });
      });

      test('branch useStdOrigin=true: retorna q + pos', () => {
        const T = new Transform2d(createVector(10, 20), createVector(0, -1)); 
        const P = createVector(2, 3);
        const q = T.transformBase2Std(P,true);
        expect({ x: q.x, y: q.y, z: q.z }).toEqual({ x: 12, y: 17, z: 0 });
      });
    });
  });
});