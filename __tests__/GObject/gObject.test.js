
require('../p5.mock.js');
const { GObject } = require('../../gameObject.js');

jest.mock('../../gameObject.js', () => {
  const originalModule = jest.requireActual('../../gameObject.js');
  return {
    ...originalModule,
    Transform2d: jest.fn(),
    RigidBody: jest.fn().mockImplementation(() => ({
      update: jest.fn(),
    })),
  };
});

describe('GObject (Complejidad 1)', () => {
  let gObject;
  beforeEach(() => {
    const { Transform2d, RigidBody } = require('../../gameObject.js');
    Transform2d.mockClear();
    RigidBody.mockClear();
    gObject = new GObject(global.createVector(10, 20));
  });

  test('constructor debe crear transform y rigidBody', () => {
    const { Transform2d, RigidBody } = require('../../gameObject.js');
    expect(Transform2d).toHaveBeenCalledTimes(1);
    expect(RigidBody).toHaveBeenCalledTimes(1);
    expect(gObject.transform).toBeDefined();
    expect(gObject.rigidBody).toBeDefined();
  });
  
  test('update debe llamar a rigidBody.update', () => {
    gObject.update();
    expect(gObject.rigidBody.update).toHaveBeenCalledTimes(1);
  });

  test('deactivateRigidBody debe poner active en false', () => {
    gObject.rigidBody.active = true;
    gObject.deactivateRigidBody();
    expect(gObject.rigidBody.active).toBe(false);
  });
  
  test('activateRigidBody debe poner active en true', () => {
    gObject.rigidBody.active = false;
    gObject.activateRigidBody();
    expect(gObject.rigidBody.active).toBe(true);
  });
  
  test('draw debe ser una función vacía que no lanza error', () => {
    expect(() => gObject.draw()).not.toThrow();
  });
});