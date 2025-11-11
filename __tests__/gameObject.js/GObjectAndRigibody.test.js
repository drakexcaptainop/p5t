
let { Transform2d, VUtils,RigidBody,GObject } = require('../../gameObject');
describe('GObject & RigidBody (con Transform2d y VUtils reales)', () => {
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
  describe('GObject', () => {
    test('constructor: crea transform (con pos) y rigidBody (que referencia al GObject)', () => {
      const pos = createVector(10, 20);
      const go = new GObject(pos);

      expect({ x: go.transform.pos.x, y: go.transform.pos.y, z: go.transform.pos.z })
        .toEqual({ x: 10, y: 20, z: 0 });
      expect(go.rigidBody instanceof RigidBody).toBe(true);
      expect(go.rigidBody.gameObject).toBe(go);
    });


    test('deactivateRigidBody()/activateRigidBody(): alternan active y retornan this', () => {
      const go = new GObject(createVector(0, 0));

      const ret1 = go.deactivateRigidBody();
      expect(go.rigidBody.active).toBe(false);
      expect(ret1).toBe(go);

      const ret2 = go.activateRigidBody();
      expect(go.rigidBody.active).toBe(true);
      expect(ret2).toBe(go);
    });
  });

  describe('RigidBody', () => {
    test('constructor: inicializa velocity, gravity, mass por defecto, active y maxAbsVelocity', () => {
      const go = new GObject(createVector(0, 0));
      const rb = new RigidBody(go);

      expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z }).toEqual({ x: 0, y: 0, z: 0 });
      expect({ x: rb.gravity.x, y: rb.gravity.y, z: rb.gravity.z }).toEqual({ x: 0, y: GLOBALS.DefaultGravity, z: 0 });
      expect(rb.mass).toBe(GLOBALS.DefaultMass);
      expect(rb.active).toBe(true);
      expect(rb.maxAbsVelocity).toBe(GLOBALS.DefaultMaxAbsVelocity);
    });

    test('constructor: respeta mass explícita', () => {
      const go = new GObject(createVector(0, 0));
      const rb = new RigidBody(go, 5);
      expect(rb.mass).toBe(5);
    });

    test('massRescale(v): retorna v * (1/mass)', () => {
      const go = new GObject(createVector(0, 0));
      const rb = new RigidBody(go, 2);
      const v = createVector(4, -6);
      const r = rb.massRescale(v);
      expect({ x: r.x, y: r.y, z: r.z }).toEqual({ x: 2, y: -3, z: 0 });
    });

    test('constrainVelocity(): clamp de velocity en [-max, max] usando VUtils real', () => {
      const go = new GObject(createVector(0, 0));
      const rb = new RigidBody(go);
      rb.velocity = createVector(100, -100);
      rb.constrainVelocity();
      expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z })
        .toEqual({ x: GLOBALS.DefaultMaxAbsVelocity, y: -GLOBALS.DefaultMaxAbsVelocity, z: 0 });
    });

    describe('update()', () => {
      test('branch inactivo: no cambia velocity ni mueve el objeto (retorno anticipado)', () => {
        const go = new GObject(createVector(0, 0));
        const rb = new RigidBody(go);
        rb.active = false;

        const v0 = createVector(rb.velocity.x, rb.velocity.y, rb.velocity.z);
        const p0 = createVector(go.transform.pos.x, go.transform.pos.y, go.transform.pos.z);

        rb.update();

        expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z })
          .toEqual({ x: v0.x, y: v0.y, z: v0.z });
        expect({ x: go.transform.pos.x, y: go.transform.pos.y, z: go.transform.pos.z })
          .toEqual({ x: p0.x, y: p0.y, z: p0.z });
      });

      test('branch activo: integra gravedad en base del objeto, limita y traslada (usando Transform2d/VUtils reales)', () => {
        const pos = createVector(0, 0);
        const go = new GObject(pos);
        const rb = go.rigidBody;

        rb.active = true;
        rb.mass = 2;                 // para ver efecto de 1/m
        rb.velocity = createVector(1, 1); 

        const g = GLOBALS.DefaultGravity;
        const expectedV = { x: 1 + 0, y: 1 + (-g) / rb.mass, z: 0 };

        const before = { x: go.transform.pos.x, y: go.transform.pos.y, z: go.transform.pos.z };

        rb.update();

        expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z })
          .toEqual(expectedV);

        expect({ x: go.transform.pos.x, y: go.transform.pos.y, z: go.transform.pos.z })
          .toEqual({ x: before.x + expectedV.x, y: before.y + (-expectedV.y), z: before.z });
      });
    });

    describe('addForce(F)', () => {
      test('branch inactivo: no modifica velocity', () => {
        const go = new GObject(createVector(0, 0));
        const rb = new RigidBody(go, 2);
        rb.active = false;

        const v0 = createVector(rb.velocity.x, rb.velocity.y, rb.velocity.z);
        rb.addForce(createVector(10, 10));

        expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z })
          .toEqual({ x: v0.x, y: v0.y, z: v0.z });
      });

      test('branch activo: suma F/mass a velocity (usando massRescale real)', () => {
        const go = new GObject(createVector(0, 0));
        const rb = new RigidBody(go, 4); 
        rb.active = true;
        rb.velocity = createVector(1, 2);

        rb.addForce(createVector(8, -12)); 

        expect({ x: rb.velocity.x, y: rb.velocity.y, z: rb.velocity.z })
          .toEqual({ x: 3, y: -1, z: 0 });
      });
    });
  });
});