require('../p5.mock.js'); 
const { VUtils } = require('../../gameObject.js');

describe('VUtils (Complejidad 1)', () => {

  test('ortho2 debe devolver un vector ortogonal rotado 90 grados', () => {
    const u = createVector(2, 3);
    const ortho = VUtils.ortho2(u);
    expect(ortho.x).toBe(-3);
    expect(ortho.y).toBe(2);
  });

  test('base2std debe transformar coordenadas de base a estándar', () => {
    const b1 = createVector(1, 0);
    const b2 = createVector(0, 1);
    const alpha = createVector(4, -2);
    const std = VUtils.base2std(b1, b2, alpha);
    expect(std.x).toBe(4);
    expect(std.y).toBe(-2);
  });

  test('std2orthobase proyecta a la base ortonormal', () => {
    const b1 = createVector(1, 0);
    const b2 = createVector(0, 1);
    const std = createVector(3, 5);
    const coords = VUtils.std2orthobase(b1, b2, std);
    expect(coords.x).toBeCloseTo(3);
    expect(coords.y).toBeCloseTo(5);
  });

  test('rotate aplica una rotación antihoraria', () => {
    const u = createVector(1, 0);
    const rotated = VUtils.rotate(u, Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0, 5);
    expect(rotated.y).toBeCloseTo(1, 5);
  });

  test('clamp restringe cada componente dentro del rango', () => {
    const v = createVector(5, -3);
    const clamped = VUtils.clamp(v, -1, 2);
    expect(clamped.x).toBe(2);
    expect(clamped.y).toBe(-1);
  });
});