
require('../p5.mock.js');
const { BB, Ray } = require('../../primitives.js');

describe('BB class', () => {
  let bb;
  let transformMock;

  beforeEach(() => {
    transformMock = {
      pos: createVector(0, 0, 0),
      transformStd2Base: jest.fn(v => v),
      transformBase2Std: jest.fn((v, useOrigin) => useOrigin ? v.add(transformMock.pos) : v),
    };
    bb = new BB(transformMock, 100, 100);
  });
  
  test('constructor debe asignar dimensiones', () => {
    expect(bb.width).toBe(100);
    expect(bb.height).toBe(100);
    expect(bb.widthd2).toBe(50);
    expect(bb.heightd2).toBe(50);
  });
  
  test('get corner debe devolver la esquina superior izquierda', () => {
    const corner = bb.corner;
    expect(corner.x).toBe(-50);
    expect(corner.y).toBe(-50);
  });

  describe('slabTest2', () => {
    test('debe devolver true para un rayo que intersecta la caja', () => {
      const ray = new Ray(createVector(-100, 0), createVector(1, 0));
      const [hasHit, P] = bb.slabTest2(ray);
      expect(hasHit).toBe(true);
      expect(P.x).toBeCloseTo(-50); 
    });

    test('debe devolver false para un rayo que no intersecta', () => {
      const ray = new Ray(createVector(-100, 100), createVector(1, 0)); 
      const [hasHit] = bb.slabTest2(ray);
      expect(hasHit).toBe(false);
    });
  });

  test('getClosest debe restringir un punto al interior de la caja', () => {
    const P = createVector(100, 20); 
    const closest = bb.getClosest(P, false);
    expect(closest.x).toBe(50);  
    expect(closest.y).toBe(20);
  });
});