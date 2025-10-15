
require('../p5.mock.js');
const { Ray } = require('../../primitives.js');

describe('Ray class', () => {
  let ray;
  const origin = createVector(0, 0, 0);
  const direction = createVector(1, 0, 0);

  beforeEach(() => {
    ray = new Ray(origin, direction);
  });

  test('constructor debe asignar origen y dirección', () => {
    expect(ray.r0).toBe(origin);
    expect(ray.rd).toBe(direction);
  });

  test('eval debe calcular un punto a lo largo del rayo', () => {
    const point = ray.eval(10);
    expect(point.x).toBe(10);
    expect(point.y).toBe(0);
    expect(point.z).toBe(0);
  });
  

  describe('intersectPlaneComponentBounded', () => {
    test('debe devolver t si es positivo', () => {
      const w = createVector(1, 0, 0);
      const x0 = createVector(10, 0, 0);
      const t = ray.intersectPlaneComponentBounded(w, x0);
      expect(t).toBe(10);
    });

    test('debe devolver Infinity si t es negativo', () => {
      const w = createVector(1, 0, 0);
      const x0 = createVector(-10, 0, 0);
      const t = ray.intersectPlaneComponentBounded(w, x0);
      expect(t).toBe(Infinity);
    });
  });

  describe('intersectSphereComponent', () => {
    test('debe devolver Infinity si no hay intersección (discriminante < 0)', () => {
      const center = createVector(10, 5, 0); 
      const radius = 1;
      const t = ray.intersectSphereComponent(center, radius);
      expect(t).toBe(Infinity);
    });

    test('debe devolver el t más cercano y positivo para intersección', () => {
      
      const center = createVector(5, 0, 0);
      const radius = 2;
      const t = ray.intersectSphereComponent(center, radius);
      expect(t).toBeCloseTo(3);
    });
    
    test('debe devolver el segundo t si el primero es negativo', () => {
      const rayInside = new Ray(createVector(5, 0, 0), createVector(1, 0, 0));
      const center = createVector(5, 0, 0);
      const radius = 2;
      const t = rayInside.intersectSphereComponent(center, radius);
      expect(t).toBeCloseTo(2); 
    });
  });

  test('draw debe llamar a ellipse y line', () => {
    ray.draw(50);
    expect(global.ellipse).toHaveBeenCalledWith(0, 0, 20);
    expect(global.line).toHaveBeenCalledWith(0, 0, 50, 0);
  });
});