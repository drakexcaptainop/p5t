
require('../p5.mock.js'); 
const { Transform2d } = require('../../gameObject.js');

describe('Transform2d (Complejidad 1)', () => {
  let transform;

  beforeEach(() => {
    transform = new Transform2d(createVector(10, 20));
  });

  
  test('constructor debe establecer la posición y la base por defecto', () => {
    expect(transform.pos.x).toBe(10);
    expect(transform.pos.y).toBe(20);

    expect(transform.fwd.x).toBe(0);
    expect(transform.fwd.y).toBe(-1);
    expect(transform.right.x).toBe(1);
    expect(transform.right.y).toBe(0);
  });
  
  test('computeBase debe actualizar los vectores fwd y right', () => {
    const newFwd = createVector(0, 1);
    transform.computeBase(newFwd);

    expect(transform.fwd).toBe(newFwd);
    expect(transform.right.x).toBe(-1); 
    expect(transform.right.y).toBe(0);
  });

  test('computeRot debe calcular el ángulo de rotación zrot', () => {
    transform.computeRot();
    expect(transform.zrot).toBeCloseTo(0);

    transform.computeBase(createVector(0, 1)); 
    transform.computeRot();
    expect(transform.zrot).toBeCloseTo(Math.PI);
  });
  
  test('base2Std debe transformar coordenadas de base a estándar', () => {
    const localCoords = createVector(3, 2); 
    const stdCoords = transform.base2Std(localCoords);

    
    expect(stdCoords.x).toBe(3);
    expect(stdCoords.y).toBe(-2);
  });

  test('std2Base debe transformar coordenadas estándar a la base local', () => {
    
    const stdCoords = createVector(5, -4);
    const localCoords = transform.std2Base(stdCoords);

   
    expect(localCoords.x).toBe(5);
    expect(localCoords.y).toBe(4);
  });
  
  test('rotate debe actualizar la base y la rotación', () => {
    transform.rotate(Math.PI / 2); 

    expect(transform.fwd.x).toBeCloseTo(1);
    expect(transform.fwd.y).toBeCloseTo(0);

    expect(transform.right.x).toBeCloseTo(0);
    expect(transform.right.y).toBeCloseTo(1);
    
    expect(transform.zrot).toBeCloseTo(Math.PI / 2);
  });

});