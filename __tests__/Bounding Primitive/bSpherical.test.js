
require('../p5.mock.js');
const { BSpherical, Ray } = require('../../primitives.js');

describe('BSpherical class', () => {
  let sphere;
  let transformMock;

  beforeEach(() => {
    transformMock = {
      pos: createVector(10, 0, 0)
    };
    sphere = new BSpherical(5, transformMock);
  });

  test('constructor debe llamar a super y asignar radio', () => {
    expect(sphere.transform).toBe(transformMock);
    expect(sphere.rad).toBe(5);
  });

  describe('checkHit', () => {
    test('debe devolver hasHit=true y el punto de colisión', () => {
      const ray = new Ray(createVector(0, 0, 0), createVector(1, 0, 0));
      const [hasHit, P] = sphere.checkHit(ray);
      
      expect(hasHit).toBe(true);
      expect(P.x).toBeCloseTo(5); 
    });

    test('debe devolver hasHit=false si no hay colisión', () => {
      const ray = new Ray(createVector(0, 50, 0), createVector(1, 0, 0)); 
      const [hasHit, P] = sphere.checkHit(ray);
      
      expect(hasHit).toBe(false);
      expect(P.x).toBe(Infinity);
    });
  });

  test('getClosest debe devolver el punto más cercano en la superficie', () => {
    const P = createVector(20, 0, 0); 
    
    global.p5.Vector.sub().mag = jest.fn(() => 10);
    global.p5.Vector.sub().normalize = jest.fn(() => createVector(1, 0, 0));

    const closestPoint = sphere.getClosest(P);
    
    expect(closestPoint.x).toBe(5);
  });
});