// World.test.js
const { World } = require('../../rasycastUtils');

describe("World.prototype.intersectClosestBB", () => {
    beforeAll(() => {
    global.p5 = {
      Vector: {
        sub: (P, r0) => ({
          mag: () => Math.hypot(
            (P.x ?? 0) - (r0.x ?? 0),
            (P.y ?? 0) - (r0.y ?? 0),
            (P.z ?? 0) - (r0.z ?? 0),
          ),
        }),
      },
    };
  });

  test("retorna hasHit=false cuando no hay ningún AABB que colisione", () => {
    const world = new World();
    const rayMock = { r0: { x: 0, y: 0, z: 0 } };
    const hit = world.intersectClosestBB(rayMock);
    expect(hit.hasHit).toBe(false);
    expect(hit.obj).toBe(null);
    expect(hit.P).toBe(null);
  });

  test("retorna hasHit=false cuando no hay ningún AABB que colisione", () => {
    const world = new World();
    const obj = { id: 1 };
    world.push(obj);

    jest.spyOn(world, 'hasBB').mockImplementation((o) => null);

    const ray = { r0: { x: 0, y: 0, z: 0 } };
    const hit = world.intersectClosestBB(ray);

    expect(hit.hasHit).toBe(false);
    expect(hit.obj).toBe(null);
    expect(hit.P).toBe(null);
  });

  test("elige el impacto más cercano entre varios AABB que sí colisionan", () => {
    const world = new World();
    const a = { id: 'A' };
    const b = { id: 'B' };
    world.push(a, b);

    const bbA = { checkHit: jest.fn().mockReturnValue([true, { x: 5, y: 0, z: 0 }]) }; // distancia 5
    const bbB = { checkHit: jest.fn().mockReturnValue([true, { x: 0, y: 3, z: 0 }]) }; // distancia 3 (más cercano)

    const map = new Map([[a, bbA], [b, bbB]]);
    jest.spyOn(world, 'hasBB').mockImplementation((o) => map.get(o) ?? null);

    const ray = { r0: { x: 0, y: 0, z: 0 } };
    const hit = world.intersectClosestBB(ray);

    expect(hit.hasHit).toBe(true);
    expect(hit.obj).toBe(b);
    expect(hit.P).toEqual({ x: 0, y: 3, z: 0 });
    expect(bbA.checkHit).toHaveBeenCalledWith(ray);
    expect(bbB.checkHit).toHaveBeenCalledWith(ray);
  });

  test("ignora objetos sin AABB o sin impacto y retorna el más cercano válido", () => {
    const world = new World();
    const noBB = { id: 'N' };
    const miss = { id: 'M' };
    const hitC = { id: 'C' };
    world.push(noBB, miss, hitC);

    const bbMiss = { checkHit: jest.fn().mockReturnValue([false, null]) };
    const bbHitC = { checkHit: jest.fn().mockReturnValue([true, { x: 1, y: 1, z: 0 }]) }; // dist ~1.414

    jest.spyOn(world, 'hasBB').mockImplementation((o) => {
      if (o === miss) return bbMiss;
      if (o === hitC) return bbHitC;
      return null; 
    });
    const ray = { r0: { x: 0, y: 0, z: 0 } };
    const hit = world.intersectClosestBB(ray);

    expect(hit.hasHit).toBe(true);
    expect(hit.obj).toBe(hitC);
    expect(hit.P).toEqual({ x: 1, y: 1, z: 0 });
  });
});


// World.test.js

describe("World.prototype.hasBB", () => {
    beforeAll(() => {
    class MockBB {}
    global.MockBB = MockBB
    global.BB = MockBB
    global.p5 = {
      Vector: {
        sub: (P, r0) => ({
          mag: () => Math.hypot(
            (P.x ?? 0) - (r0.x ?? 0),
            (P.y ?? 0) - (r0.y ?? 0),
            (P.z ?? 0) - (r0.z ?? 0),
          ),
        }),
      },
    };
  });
  test("retorna la instancia de BB cuando el objeto contiene una", () => {
    
    const world = new World();
    const bb = new MockBB();
    const obj = { a: 1, hitbox: bb };

    const result = world.hasBB(obj);

    expect(result).toBe(bb);
  });

  test("retorna null cuando el objeto no contiene una instancia de BB", () => {
    const world = new World();
    const obj = { x: 1, y: 2, z: 3 };

    const result = world.hasBB(obj);

    expect(result).toBeNull();
  });

  test("retorna la primera instancia de BB si hay multiples", () => {
    const world = new World();
    const bb1 = new MockBB();
    const bb2 = new MockBB();
    const obj = { first: bb1, second: bb2 };

    const result = world.hasBB(obj);

    expect(result).toBe(bb1);
  });

  test("retorna null cuando el objeto está vacío", () => {
    const world = new World();
    const obj = {};

    const result = world.hasBB(obj);

    expect(result).toBeNull();
  });
});