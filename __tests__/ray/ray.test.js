// Ray.test.js
const {Ray} = require('../../primitives')

describe('Ray.prototype.intersectSphereComponent', () => {
  beforeAll(() => {
    global.p5 = {
      Vector: {
        sub: (a, b) => ({
          x: a.x - b.x,
          y: a.y - b.y,
          z: a.z - b.z,
          dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
          },
        }),
      },
    };
    global.PRIMITIVE_GLOBALS = { Eps: 1e-6 };
    global.createVector = (x1, y1, z1) => {return{x:x1||0, y: y1||0, z:z1||0 } }
  });

  test('retorna el t más cercano positivo cuando el rayo intersecta la esfera', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = {
      x: 1,
      y: 0,
      z: 0,
      dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      },
    };
    const ray = new Ray(r0, rd);
    const t = ray.intersectSphereComponent({ x: 5, y: 0, z: 0 }, 1);
    expect(t).toBeCloseTo(4, 3);
  });

  test('retorna Infinity cuando no hay intersección (discriminante < 0)', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = {
      x: 1,
      y: 0,
      z: 0,
      dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      },
    };
    const ray = new Ray(r0, rd);
    const t = ray.intersectSphereComponent({ x: 0, y: 10, z: 0 }, 1);
    expect(t).toBe(Infinity);
  });

  test('retorna Infinity si ambas soluciones son negativas (esfera detrás del origen)', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = {
      x: 1,
      y: 0,
      z: 0,
      dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      },
    };
    const ray = new Ray(r0, rd);

    const t = ray.intersectSphereComponent({ x: -5, y: 0, z: 0 }, 1);
    expect(t).toBe(Infinity);
  });

  test('retorna t0 si t0 > Eps y t1 > Eps pero t0 < t1', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = {
      x: 1,
      y: 0,
      z: 0,
      dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      },
    };
    const ray = new Ray(r0, rd);
    const t = ray.intersectSphereComponent({ x: 10, y: 0, z: 0 }, 3);
    expect(t).toBeCloseTo(7, 1);
  });
});




describe('Ray (métodos sin control de flujo)', () => {
  beforeAll(() => {
    global.ellipse = jest.fn();
    global.line = jest.fn();

    const makeVec = (x = 0, y = 0, z = 0) => ({
      x, y, z,
      add(v) {
        return makeVec(this.x + (v.x ?? 0), this.y + (v.y ?? 0), this.z + (v.z ?? 0));
      },
      dot(v) {
        return this.x * (v.x ?? 0) + this.y * (v.y ?? 0) + this.z * (v.z ?? 0);
      },
      normalize() {
        const n = Math.hypot(this.x, this.y, this.z) || 1;
        return makeVec(this.x / n, this.y / n, this.z / n);
      },
    });

    global.createVector = (x = 0, y = 0, z = 0) => makeVec(x, y, z);

    global.p5 = {
      Vector: {
        mult: (v, t) => makeVec((v.x ?? 0) * t, (v.y ?? 0) * t, (v.z ?? 0) * t),
        sub:  (a, b) => makeVec((a.x ?? 0) - (b.x ?? 0), (a.y ?? 0) - (b.y ?? 0), (a.z ?? 0) - (b.z ?? 0)),
      },
    };
  });

  test('eval(t): r0 + t * rd', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = { x: 3, y: 0, z: 0 };
    const ray = new Ray(r0, rd);

    const R = ray.eval(1);
    expect(R.x).toBe(3);
    expect(R.y).toBe(0);
    expect(R.z).toBe(0);
  });

  test('vectorTo(u): u - r0', () => {
    const r0 = { x: 1, y: 2, z: 0 };
    const rd = { x: 0, y: 1, z: 0, dot(v){ return 0; } };
    const ray = new Ray(r0, rd);

    const v = ray.vectorTo({ x: 4, y: 6, z: 0 });
    expect({x: v.x, y: v.y, z: v.z}).toEqual({ x: 3, y: 4, z: 0 });
  });

  test('intersectPlaneComponent(w, x0): ((x0 - r0)·w) / (rd·w)', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = { x: 2, y: 3, z: 0, dot(v){ return this.x*v.x + this.y*v.y + this.z*(v.z??0); } };
    const ray = new Ray(r0, rd);

    const w  = { x: 0, y: 1, z: 0 };          
    const x0 = { x: 0, y: 5, z: 0 };          
    const t = ray.intersectPlaneComponent(w, x0); // ( (0,5)-(0,0) )·(0,1) / ( (2,3)·(0,1) ) = 5/3
    expect(t).toBeCloseTo(5/3, 10);
  });

  test('intersectPlane(w, x0): eval(intersectPlaneComponent)', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = { x: 1, y: 2, z: 0, dot(v){ return this.x*v.x + this.y*v.y + this.z*(v.z??0); } };
    const ray = new Ray(r0, rd);

    const w  = { x: 0, y: 1, z: 0 }; // plano y = 4
    const x0 = { x: 0, y: 4, z: 0 };
    const P = ray.intersectPlane(w, x0); // t = 4/2 = 2 → (2,4,0)
    expect({x: P.x, y: P.y, z: P.z}).toEqual({ x: 2, y: 4, z: 0 });
  });

  test('intersectCurrentStdBase(): intersecciones con planos x=0 e y=0', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = { x: 1, y: 2, z: 0, dot(v){ return this.x*v.x + this.y*v.y + this.z*(v.z??0); } };
    const ray = new Ray(r0, rd);

    const [Px, Py] = ray.intersectCurrentStdBase(); 
    expect({x: Px.x, y: Px.y, z: Px.z}).toEqual({ x: 0, y: 0, z: 0 });
    expect({x: Py.x, y: Py.y, z: Py.z}).toEqual({ x: 0, y: 0, z: 0 });
  });

  test('getSphereComponentDiscriminant(): b^2 - 4ac con a=rd·rd, b=2 rd·oc, c=oc·oc - r^2', () => {
    const r0 = { x: 0, y: 0, z: 0 };
    const rd = { x: 1, y: 0, z: 0, dot(v){ return this.x*v.x + this.y*v.y + this.z*(v.z??0); } };
    const ray = new Ray(r0, rd);

    const center = { x: 5, y: 0, z: 0 };
    const radius = 1;

    const D = ray.getSphereComponentDiscriminant(center, radius);
    expect(D).toBeCloseTo(4, 12);
  });

  test('intersectSphere(center, radius): eval(t) con t', () => {
    const r0 = { x: 1, y: 1, z: 0 };
    const rd = { x: 2, y: 0, z: 0, dot(v){ return this.x*v.x + this.y*v.y + this.z*(v.z??0); } };
    const ray = new Ray(r0, rd);

    const spy = jest.spyOn(Ray.prototype, 'intersectSphereComponent').mockReturnValue(3);
    const P = ray.intersectSphere({ x: 0, y: 0, z: 0 }, 1); 

    expect(spy).toHaveBeenCalled();
    expect({x: P.x, y: P.y, z: P.z}).toEqual({ x: 7, y: 1, z: 0 });
  });


  test('lookAt(P): actualiza rd a (P - r0) normalizado', () => {
    const r0 = { x: 1, y: 2, z: 0 };
    const rd = { x: 0, y: 0, z: 0, dot(v){ return 0; } };
    const ray = new Ray(r0, rd);

    const P = { x: 5, y: 2, z: 0 };
    ray.lookAt(P);

    expect(ray.rd.x).toBeCloseTo(1, 12);
    expect(ray.rd.y).toBeCloseTo(0, 12);
    expect(ray.rd.z).toBeCloseTo(0, 12);
  });
});