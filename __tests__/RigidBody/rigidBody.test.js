
require('../p5.mock.js'); 
const { RigidBody } = require('../../gameObject.js');

describe('RigidBody (Complejidad 1)', () => {
  let rigidBody;
  let mockGameObject;

  beforeEach(() => {
    mockGameObject = {}; 
    rigidBody = new RigidBody(mockGameObject);
  });

  describe('constructor', () => {
    test('debe inicializar propiedades básicas', () => {
      expect(rigidBody.gameObject).toBe(mockGameObject);
      expect(rigidBody.velocity).toBeDefined();
      expect(rigidBody.gravity).toBeDefined();
      expect(rigidBody.active).toBe(true);
    });

    test('debe usar la masa por defecto si no se proporciona una', () => {
      expect(rigidBody.mass).toBe(1);
    });
    
    test('debe usar la masa proporcionada', () => {
      const rbWithMass = new RigidBody(mockGameObject, 10);
      expect(rbWithMass.mass).toBe(10);
    });
  });

  describe('massRescale', () => {
    test('debe escalar un vector por la inversa de la masa', () => {
      rigidBody.mass = 2;
      const vector = createVector(10, -20);
      const rescaled = rigidBody.massRescale(vector);

      expect(p5.Vector.mult).toHaveBeenCalledWith(vector, 0.5);
      
      const expectedVector = global.p5.Vector.mult(vector, 1 / rigidBody.mass);
      expect(rescaled.x).toBe(expectedVector.x);
      expect(rescaled.y).toBe(expectedVector.y);
    });
  });
  
  describe('constrainVelocity', () => {
    test('debe restringir la velocidad a los límites definidos', () => {
     
      rigidBody.velocity = createVector(100, -50);
      
      rigidBody.constrainVelocity();
      
      expect(rigidBody.velocity.x).toBe(4);
      expect(rigidBody.velocity.y).toBe(-4);
    });
  });

  
});