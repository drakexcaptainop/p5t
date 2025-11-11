
describe('Prefabs (Ell, Rect, Triangle, Barrel) with real GObject/Transform2d/RigidBody/VUtils', () => {
  const makeVec = (x = 0, y = 0, z = 0) => ({
    x, y, z,
    add(v) { this.x += (v.x ?? 0); this.y += (v.y ?? 0); this.z += (v.z ?? 0); return this; },
    sub(v) { this.x -= (v.x ?? 0); this.y -= (v.y ?? 0); this.z -= (v.z ?? 0); return this; },
    mult(t) { this.x *= t; this.y *= t; this.z *= t; return this; },
    dot(v) { return this.x * (v.x ?? 0) + this.y * (v.y ?? 0) + this.z * (v.z ?? 0); },
    mag() { return Math.hypot(this.x, this.y, this.z); },
    normalize() { const n = this.mag() || 1; this.x /= n; this.y /= n; this.z /= n; return this; },
    heading() { return Math.atan2(this.y, this.x); },
    clone() { return makeVec(this.x, this.y, this.z); },
  });

  let Transform2d, RigidBody, GObject, VUtils, Ell, Rect, Triangle, Barrel, BB;

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
    global.TWO_PI = Math.PI * 2;

    global.GLOBALS = {
      DefaultGravity: 0.2,
      DefaultMass: 1,
      DefaultGOSize: 50,
      DefaultBaseDrawMag: 50,
      DefaultMaxAbsVelocity: 4,
    };


    const gameObjectMod = require('../../gameObject.js');
    Transform2d = gameObjectMod.Transform2d;
    RigidBody   = gameObjectMod.RigidBody;
    GObject     = gameObjectMod.GObject;
    VUtils      = gameObjectMod.VUtils;

    global.Transform2d = Transform2d
    global.GObject = GObject
    global.RigidBody = RigidBody
    global.VUtils = gameObjectMod.VUtils

    ({ Ell, Rect, Triangle, Barrel } = require('../../prefabs'));

    ({ BB } = require('../../primitives.js'));


  });

  describe('Ell', () => {
    test('constructor sets transform.pos and explicit size', () => {
      const pos = createVector(10, 20);
      const e = new Ell(pos, 7);

      expect({ x: e.transform.pos.x, y: e.transform.pos.y, z: e.transform.pos.z })
        .toEqual({ x: 10, y: 20, z: 0 });
      expect(e.size).toBe(7);
    });

    test('constructor uses GLOBALS.DefaultGOSize when size is falsy', () => {
      const pos = createVector(-3, 5);
      const e = new Ell(pos);

      expect({ x: e.transform.pos.x, y: e.transform.pos.y, z: e.transform.pos.z })
        .toEqual({ x: -3, y: 5, z: 0 });
      expect(e.size).toBe(GLOBALS.DefaultGOSize);
    });
  });

  describe('Rect', () => {
    test('constructor creates bb with the Rect transform; width/height set', () => {
      if (typeof BB !== 'function') {
        return;
      }
      const pos = createVector(1, 2);
      const r = new Rect(pos, 8, 6);

      expect({ x: r.transform.pos.x, y: r.transform.pos.y, z: r.transform.pos.z })
        .toEqual({ x: 1, y: 2, z: 0 });
      expect(r.bb).toBeInstanceOf(BB);
      expect(r.bb.transform).toBe(r.transform);
      expect(r.bb.width).toBe(8);
      expect(r.bb.height).toBe(6);
    });

    test('height defaults to width when omitted', () => {
      if (typeof BB !== 'function') return;

      const r = new Rect(createVector(0, 0), 10);
      expect(r.bb.width).toBe(10);
      expect(r.bb.height).toBe(10);
    });
  });

  describe('Triangle', () => {
    test('constructor sets transform.pos to iterative midpoint and stores verts', () => {
      const p1 = createVector(0, 0);
      const p2 = createVector(4, 0);
      const p3 = createVector(4, 4);

      const expected = { x: 3, y: 2, z: 0 };

      const tri = new Triangle(p1, p2, p3);

      expect({ x: tri.transform.pos.x, y: tri.transform.pos.y, z: tri.transform.pos.z })
        .toEqual(expected);

      expect(tri.verts.length).toBe(3);
      expect({ x: tri.verts[0].x, y: tri.verts[0].y, z: tri.verts[0].z })
        .toEqual({ x: p1.x, y: p1.y, z: p1.z });
      expect({ x: tri.verts[1].x, y: tri.verts[1].y, z: tri.verts[1].z })
        .toEqual({ x: p2.x, y: p2.y, z: p2.z });
      expect({ x: tri.verts[2].x, y: tri.verts[2].y, z: tri.verts[2].z })
        .toEqual({ x: p3.x, y: p3.y, z: p3.z });
    });
  });

  describe('Barrel', () => {
    test('constructor initializes rad, diam, N, rotStep, and state fields', () => {
      const b = new Barrel(createVector(0, 0), 5, 8);

      expect({ x: b.transform.pos.x, y: b.transform.pos.y, z: b.transform.pos.z })
        .toEqual({ x: 0, y: 0, z: 0 });
      expect(b.rad).toBe(5);
      expect(b.diam).toBe(10);
      expect(b.N).toBe(8);
      expect(b.rotStep).toBeCloseTo(TWO_PI / 8, 12);
      expect(b.rot).toBe(0);
      expect(b.next).toBe(1);
      expect(b.target).toBe(0);
      expect(b.targetAngle).toBe(0);
      expect(b.bulletIndex).toBe(4);
      expect(b.currentTurns).toBe(0);
    });

    test('stepState() advances target/next, wraps, increments currentTurns at wrap, and sets targetAngle', () => {
      const b = new Barrel(createVector(0, 0), 5, 6);

      b.stepState();
      expect(b.target).toBe(1);
      expect(b.next).toBe(2);
      expect(b.currentTurns).toBe(0);
      const expectedAngle1 = 1 / 6 * (TWO_PI + b.rotStep);
      expect(b.targetAngle).toBeCloseTo(expectedAngle1, 12);

      b.next = 5;
      b.stepState(); 
      expect(b.target).toBe(5);
      expect(b.next).toBe(0);
      expect(b.currentTurns).toBe(1);
      const expectedAngle2 = 5 / 6 * (TWO_PI + b.rotStep);
      expect(b.targetAngle).toBeCloseTo(expectedAngle2, 12);
    });

    test('update() increases rot by rotStep/10 and clamps to targetAngle', () => {
      const b = new Barrel(createVector(0, 0), 5, 10);

      b.targetAngle = 999;
      const inc = b.rotStep / 10;
      b.update();
      expect(b.rot).toBeCloseTo(inc, 12);

      const b2 = new Barrel(createVector(0, 0), 5, 10);
      b2.targetAngle = 0.02;
      b2.rot = 0.015;
      b2.update();
      expect(b2.rot).toBeCloseTo(0.02, 12);
    });
  });
});