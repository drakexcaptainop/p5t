// tests/Matrix/matrix.test.js

const { Matrix, Vector } = require('../../vector.js');

describe('Matrix class static methods', () => {

  const testMatrixA = [[1, 2], [3, 4]];
  const testMatrixB = [[5, 6], [7, 8]];

  test('shape(B) debe devolver las dimensiones de la matriz', () => {
    expect(Matrix.shape(testMatrixA)).toEqual([2, 2]);
    expect(Matrix.shape([[1, 2, 3], [4, 5, 6]])).toEqual([2, 3]);
  });

  test('zerosMatrix(N, M) debe crear una matriz de ceros', () => {
    const zeros = Matrix.zerosMatrix(2, 3);
    expect(zeros).toEqual([[0, 0, 0], [0, 0, 0]]);
    expect(Matrix.shape(zeros)).toEqual([2, 3]);
  });

  test('copy(B) debe crear una copia profunda de la matriz', () => {
    const original = [[1, 2], [3, 4]];
    const copied = Matrix.copy(original);
    copied[0][0] = 99;
    expect(original[0][0]).toBe(1);
    expect(copied[0][0]).toBe(99);
  });

  test('baseTranspose(B) debe transponer la matriz', () => {
    const matrix = [[1, 2, 3], [4, 5, 6]];
    const transposed = Matrix.baseTranspose(matrix);
    expect(transposed).toEqual([[1, 4], [2, 5], [3, 6]]);
  });

  test('column(B, j) debe devolver la columna j', () => {
    const matrix = [[1, 2], [3, 4]];
    expect(Matrix.column(matrix, 1)).toEqual([2, 4]);
  });

  test('setColumn(B, j, column) debe establecer la columna j', () => {
    const matrix = [[0, 0], [0, 0]];
    const newCol = [5, 6];
    Matrix.setColumn(matrix, 0, newCol);
    expect(matrix).toEqual([[5, 0], [6, 0]]);
  });

  test('matMult(A, B) debe multiplicar dos matrices', () => {
    const result = Matrix.matMult(testMatrixA, testMatrixB);
    
    expect(result).toEqual([[19, 22], [43, 50]]);
  });

  test('matMult(A, B) debe lanzar un error para formas incompatibles', () => {
    const invalidMatrix = [[1, 2, 3], [4, 5, 6]]; // 2x3
    expect(() => Matrix.matMult(testMatrixA, invalidMatrix)).toThrow('Incompatible shapes');
  });

  test('mult(B, t) debe multiplicar una matriz por un escalar', () => {
    const result = Matrix.mult(testMatrixA, 2);
    expect(result).toEqual([[2, 4], [6, 8]]);
  });

  test('baseInverse2d(B) debe calcular la inversa de una matriz 2x2', () => {
    const matrix = [[4, 7], [2, 6]];
    const inverse = Matrix.baseInverse2d(matrix);
    
    expect(inverse[0][0]).toBeCloseTo(0.6);
    expect(inverse[0][1]).toBeCloseTo(-0.7);
    expect(inverse[1][0]).toBeCloseTo(-0.2);
    expect(inverse[1][1]).toBeCloseTo(0.4);

    const identity = Matrix.matMult(matrix, inverse);
    expect(identity[0][0]).toBeCloseTo(1);
    expect(identity[0][1]).toBeCloseTo(0);
    expect(identity[1][0]).toBeCloseTo(0);
    expect(identity[1][1]).toBeCloseTo(1);
  });
});